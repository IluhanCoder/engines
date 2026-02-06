import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cardService from "../services/card-service";
import Project from "../types/project-type";
import Detail from "../types/detail-type";
import DetailsList from "../static/details-list";
import LoadingScreen from "../components/loading-screen";
import Separator from "../components/separator";
import buttonStyle from "../styles/button-style";
import { grayBoldLabelStyle, largeLabelStyle, lightBoldLabelStyle } from "../styles/label-style";

const findTemplateForDetail = (detail: Detail, projectData: Detail[]) => {
    if (detail.parentIndex !== undefined) {
        const parent = projectData[detail.parentIndex];
        const candidates = parent?.allowedChildren ?? [];
        return candidates.find((candidate) => candidate.name === detail.name) ?? DetailsList.find((candidate) => candidate.name === detail.name);
    }
    return DetailsList.find((candidate) => candidate.name === detail.name);
};

interface Recommendation {
    detail: Detail;
    detailIndex: number;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    reason: string;
    remainingHours: number;
    estimatedDays: number;
}

const RecommendationsPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>();

    const fetchProject = async () => {
        const res = await cardService.getCard(projectId!);
        setProject({ ...res.data });
    };

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const recommendations = useMemo(() => {
        if (!project) return [];

        const recs: Recommendation[] = [];

        project.data.forEach((detail, index) => {
            const template = findTemplateForDetail(detail, project.data);
            const normalDurability = template?.durability ?? detail.durability;
            const remainingHours = detail.durability - detail.hoursUsed;
            const usagePercent = (detail.hoursUsed / detail.durability) * 100;
            const estimatedDays = Math.floor(remainingHours / 8);

            if (detail.isWorkedOut) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "CRITICAL",
                    reason: "Деталь повністю зношена і потребує термінової заміни",
                    remainingHours: 0,
                    estimatedDays: 0
                });
            } else if (detail.workCoef < 10) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "CRITICAL",
                    reason: `Критично низький ресурс (${detail.workCoef.toFixed(1)}%)`,
                    remainingHours,
                    estimatedDays
                });
            } else if (detail.workCoef < 25) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "HIGH",
                    reason: `Низький ресурс (${detail.workCoef.toFixed(1)}%). Рекомендована заміна найближчим часом`,
                    remainingHours,
                    estimatedDays
                });
            } else if (detail.workCoef < 40) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "MEDIUM",
                    reason: `Помірний знос (${detail.workCoef.toFixed(1)}%). Запланувати заміну`,
                    remainingHours,
                    estimatedDays
                });
            } else if (usagePercent > 70) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "LOW",
                    reason: `Профілактичний огляд рекомендовано (використано ${usagePercent.toFixed(0)}%)`,
                    remainingHours,
                    estimatedDays
                });
            }

            // Додаткові рекомендації для критичних деталей
            const lowerName = detail.name.toLowerCase();
            if (lowerName.includes("акамулятор") && detail.hoursUsed > 25000 && !detail.isWorkedOut) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "MEDIUM",
                    reason: "Акумулятор відпрацював більше 70% ресурсу. Контролюйте напругу та ємність",
                    remainingHours,
                    estimatedDays
                });
            }

            if ((lowerName.includes("мастило") || lowerName.includes("масло")) && detail.hoursUsed > 150 && !detail.isWorkedOut) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "HIGH",
                    reason: "Термін заміни мастила наближається. Заміна рекомендована кожні 200 год (5000-7500 км)",
                    remainingHours,
                    estimatedDays
                });
            }

            if (lowerName.includes("ремінь грм") && detail.hoursUsed > 6000 && !detail.isWorkedOut) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "HIGH",
                    reason: "Ремінь ГРМ наближається до кінця ресурсу. Рекомендована заміна кожні 60,000-100,000 км",
                    remainingHours,
                    estimatedDays
                });
            }

            if (lowerName.includes("свічка") && detail.hoursUsed > 3500 && !detail.isWorkedOut) {
                recs.push({
                    detail,
                    detailIndex: index,
                    priority: "MEDIUM",
                    reason: "Свічки запалювання наближаються до терміну заміни (рекомендовано кожні 30,000-100,000 км)",
                    remainingHours,
                    estimatedDays
                });
            }
        });

        // Сортуємо за пріоритетом
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }, [project]);

    const priorityColor = (priority: string) => {
        switch (priority) {
            case "CRITICAL": return "bg-red-100 border-red-500 text-red-900";
            case "HIGH": return "bg-orange-100 border-orange-500 text-orange-900";
            case "MEDIUM": return "bg-yellow-100 border-yellow-500 text-yellow-900";
            case "LOW": return "bg-blue-100 border-blue-500 text-blue-900";
            default: return "bg-gray-100 border-gray-500 text-gray-900";
        }
    };

    const priorityLabel = (priority: string) => {
        switch (priority) {
            case "CRITICAL": return "КРИТИЧНО";
            case "HIGH": return "ВИСОКИЙ";
            case "MEDIUM": return "СЕРЕДНІЙ";
            case "LOW": return "НИЗЬКИЙ";
            default: return priority;
        }
    };

    if (!project) return <LoadingScreen />;

    return (
        <div className="flex">
            <div className="overflow-auto grow">
                <div className="h-screen p-6">
                    <div className={largeLabelStyle}>Рекомендації по обслуговуванню</div>
                    
                    {recommendations.length === 0 ? (
                        <div className="mt-8 p-8 bg-green-50 border border-green-300 rounded-lg">
                            <div className="text-2xl text-green-800 font-bold">✓ Всі деталі в нормальному стані</div>
                            <div className="mt-2 text-green-700">Система не потребує термінового обслуговування</div>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="rounded border border-red-300 bg-red-50 shadow p-4">
                                    <div className={grayBoldLabelStyle}>Критично</div>
                                    <div className="text-2xl text-red-700">{recommendations.filter(r => r.priority === "CRITICAL").length}</div>
                                </div>
                                <div className="rounded border border-orange-300 bg-orange-50 shadow p-4">
                                    <div className={grayBoldLabelStyle}>Високий</div>
                                    <div className="text-2xl text-orange-700">{recommendations.filter(r => r.priority === "HIGH").length}</div>
                                </div>
                                <div className="rounded border border-yellow-300 bg-yellow-50 shadow p-4">
                                    <div className={grayBoldLabelStyle}>Середній</div>
                                    <div className="text-2xl text-yellow-700">{recommendations.filter(r => r.priority === "MEDIUM").length}</div>
                                </div>
                                <div className="rounded border border-blue-300 bg-blue-50 shadow p-4">
                                    <div className={grayBoldLabelStyle}>Низький</div>
                                    <div className="text-2xl text-blue-700">{recommendations.filter(r => r.priority === "LOW").length}</div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-6">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className={`rounded border-l-4 p-4 shadow ${priorityColor(rec.priority)}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm px-2 py-1 rounded bg-white bg-opacity-50">
                                                        {priorityLabel(rec.priority)}
                                                    </span>
                                                    <span className="font-semibold text-lg">{rec.detail.name}</span>
                                                </div>
                                                <div className="mt-2 text-sm">{rec.reason}</div>
                                                <div className="mt-2 flex gap-4 text-sm">
                                                    <div>
                                                        <span className="font-semibold">Коефіцієнт роботи:</span> {rec.detail.workCoef.toFixed(1)}%
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">Використано:</span> {rec.detail.hoursUsed.toFixed(0)} / {rec.detail.durability} год
                                                    </div>
                                                    {rec.remainingHours > 0 && (
                                                        <div>
                                                            <span className="font-semibold">Залишок:</span> {rec.remainingHours.toFixed(0)} год (~{rec.estimatedDays} днів)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 border border-gray-300 rounded-lg">
                                <div className={grayBoldLabelStyle}>Загальні рекомендації</div>
                                <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
                                    <li>Критичні деталі потребують негайної заміни для запобігання поломок</li>
                                    <li>Деталі з високим пріоритетом слід замінити протягом найближчих 2-3 тижнів</li>
                                    <li>Середній пріоритет: запланувати заміну на наступне обслуговування</li>
                                    <li>Регулярно перевіряйте рівень мастила та стан акумулятора</li>
                                    <li>Дотримуйтесь рекомендованих інтервалів технічного обслуговування</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="z-20 bg-gray-100 border-l-2 border-gray-200 shadow-lg h-screen">
                <div className="flex flex-col py-6 px-2 gap-1">
                    <div className="flex justify-center">
                        <label className={grayBoldLabelStyle}>Назва проекту:</label>
                    </div>
                    <div className="flex justify-center">
                        <label className={largeLabelStyle}>{project.name}</label>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col p-6 gap-4">
                    <div className="flex justify-center">
                        <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/project/${project._id}`)}>повернутися до проекту</button>
                    </div>
                    <div className="flex justify-center">
                        <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/testing/${project._id}`)}>режим тестування</button>
                    </div>
                    <div className="flex justify-center">
                        <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/analysis/${project._id}`)}>аналітика системи</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationsPage;
