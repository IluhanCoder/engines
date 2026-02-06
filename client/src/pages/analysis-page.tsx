import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

const AnalysisPage = () => {
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

    const summary = useMemo(() => {
        if (!project) return null;
        const details = project.data;
        const total = details.length;
        const workedOut = details.filter((detail) => detail.isWorkedOut).length;
        const averageWorkCoef = details.reduce((acc, detail) => acc + detail.workCoef, 0) / total;
        const minRemaining = details.reduce((acc, detail) => Math.min(acc, detail.durability - detail.hoursUsed), Number.POSITIVE_INFINITY);
        const maxRemaining = details.reduce((acc, detail) => Math.max(acc, detail.durability - detail.hoursUsed), 0);
        return {
            total,
            workedOut,
            averageWorkCoef,
            minRemaining,
            maxRemaining
        };
    }, [project]);

    const workCoefChartData = useMemo(() => {
        if (!project) return [];
        return project.data.map((detail, index) => ({
            name: `${detail.name} #${index + 1}`,
            workCoef: Number(detail.workCoef.toFixed(2))
        }));
    }, [project]);

    const remainingLifeData = useMemo(() => {
        if (!project) return [];
        return project.data.map((detail, index) => ({
            name: `${detail.name} #${index + 1}`,
            remaining: Number((detail.durability - detail.hoursUsed).toFixed(2))
        }));
    }, [project]);

    const deviationData = useMemo(() => {
        if (!project) return [];
        return project.data.map((detail, index) => {
            const template = findTemplateForDetail(detail, project.data);
            const normalDurability = template?.durability ?? detail.durability;
            const deviation = ((detail.durability - normalDurability) / normalDurability) * 100;
            return {
                name: `${detail.name} #${index + 1}`,
                deviation: Number(deviation.toFixed(2))
            };
        });
    }, [project]);

    const workedOutPieData = useMemo(() => {
        if (!summary) return [];
        return [
            { name: "Справні", value: summary.total - summary.workedOut },
            { name: "Потребують заміни", value: summary.workedOut }
        ];
    }, [summary]);

    if (!project || !summary) return <LoadingScreen />;

    return (
        <div className="flex">
            <div className="overflow-auto grow">
                <div className="h-screen p-6">
                    <div className={largeLabelStyle}>Аналітика системи</div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="rounded border border-gray-200 bg-white shadow p-4">
                            <div className={grayBoldLabelStyle}>Усього деталей</div>
                            <div className="text-2xl">{summary.total}</div>
                        </div>
                        <div className="rounded border border-gray-200 bg-white shadow p-4">
                            <div className={grayBoldLabelStyle}>Потребують заміни</div>
                            <div className="text-2xl">{summary.workedOut}</div>
                        </div>
                        <div className="rounded border border-gray-200 bg-white shadow p-4">
                            <div className={grayBoldLabelStyle}>Середній коефіцієнт роботи</div>
                            <div className="text-2xl">{summary.averageWorkCoef.toFixed(2)}%</div>
                        </div>
                        <div className="rounded border border-gray-200 bg-white shadow p-4">
                            <div className={grayBoldLabelStyle}>Залишковий ресурс</div>
                            <div className={lightBoldLabelStyle}>мін: {summary.minRemaining.toFixed(0)} год</div>
                            <div className={lightBoldLabelStyle}>макс: {summary.maxRemaining.toFixed(0)} год</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="rounded border border-gray-200 bg-white shadow p-4 h-80">
                            <div className={grayBoldLabelStyle}>Коефіцієнт роботи по деталях</div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={workCoefChartData} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="workCoef" fill="#2563eb" name="Коефіцієнт (%)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="rounded border border-gray-200 bg-white shadow p-4 h-80">
                            <div className={grayBoldLabelStyle}>Стан деталей</div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                        <Pie data={workedOutPieData} dataKey="value" nameKey="name" outerRadius={100} label>
                                            <Cell fill="#16a34a" />
                                            <Cell fill="#dc2626" />
                                        </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="rounded border border-gray-200 bg-white shadow p-4 h-80">
                            <div className={grayBoldLabelStyle}>Залишковий ресурс (год)</div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={remainingLifeData} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="remaining" fill="#16a34a" name="Залишок" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="rounded border border-gray-200 bg-white shadow p-4 h-80">
                            <div className={grayBoldLabelStyle}>Відхилення від нормального ресурсу (%)</div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deviationData} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="deviation" fill="#f59e0b" name="Відхилення" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
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
                        <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/recommendations/${project._id}`)}>рекомендації</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
