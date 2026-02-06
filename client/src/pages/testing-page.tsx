import { useEffect, useState } from "react";
import cardService from "../services/card-service";
import userStore from "../stores/userStore";
import Project from "../types/project-type";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/loading-screen";
import DetailComponent from "../components/detail";
import Detail from "../types/detail-type";
import DetailsList from "../static/details-list";
import Separator from "../components/separator";
import buttonStyle, { blueButtonStyle } from "../styles/button-style";
import { grayBoldLabelStyle, largeLabelStyle } from "../styles/label-style";
import inputStyle, { borderedInputStype, selectStyle } from "../styles/input-style";
import ConfirmModal from "../components/confirm-modal";

const TestingPage = () => {
    const [project, setProject] = useState<Project>();
    const [load, setLoad] = useState<number>(1);
    const [temperature, setTemperature] = useState<number>(25);
    const [testTime, setTestTime] = useState<number>(0);
    const [testStep, setTestStep] = useState<number>(30);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const {projectId} = useParams();
    const [lines, setLines] = useState<JSX.Element[]>([]);
    const navigate = useNavigate();

    const getProjectData = async () => {
        const res = await cardService.getCard(projectId!);
        setProject({...res.data});
    }

    const handleEscape = () => {
        setShowExitConfirm(true);
    }

    const confirmExit = () => {
        setShowExitConfirm(false);
        navigate("/projects");
    }

    useEffect(() => {
        if(userStore.user) {
            getProjectData();
        }
    } ,[userStore.user])

    const findAllChildren = (parentDetail: Detail) => project?.data.filter((currentDetail: Detail) => currentDetail.parentIndex === project.data.indexOf(parentDetail));
    const findAllChildrenByIndex = (index: number) => project?.data.filter((currentDetail: Detail) => currentDetail.parentIndex === index);

    const getAllowedNames = (detail: Detail) => {
        const parentDetail = project?.data[detail.parentIndex!];
        return (parentDetail) ? parentDetail!.allowedChildren!.map((child: Detail) => child.name)! : DetailsList.map((det: Detail) => det.name);
    }

    const renderDetailWithChildren = (detail: Detail) => {
        const children = findAllChildren(detail);
        const currentDetailIndex = project?.data!.indexOf(detail);
        return <div className="flex flex-col gap-8 flex-nowrap" key={currentDetailIndex} >
            <div className="flex flex-nowrap gap-5 z-10">
                <DetailComponent repairHandler={repairHandler} testingMode nameOptions={getAllowedNames(detail)} className={currentDetailIndex!.toString()} detail={detail}/>
            </div>
            <div className="flex flex-nowrap gap-8"> {
                children!.map((child: Detail) => {
                    const childIndex = project?.data!.indexOf(child);
                    const grandChilds = findAllChildren(child);
                    if(grandChilds!.length > 0) return renderDetailWithChildren(child);
                    else return <div key={childIndex} className="z-10">
                            <DetailComponent repairHandler={repairHandler} testingMode nameOptions={getAllowedNames(child)}className={childIndex!.toString()} detail={child}/>
                        </div>
                })
            }</div>
        </div>
    }

    useEffect(() => {setLines([]); generateLines()}, [project])

    const generateLines = () => {
        const newLines: JSX.Element[] = [];
        project?.data!.map((detail: Detail, detailIndex: number) => {
            const children = findAllChildren(detail);
            children!.forEach((child) => {
                const childIndex = project.data!.indexOf(child);

                const container = document.getElementsByClassName("line-container")[0];
                const containerRect = container.getBoundingClientRect();

                const fromElement = document.getElementsByClassName(detailIndex.toString())[0];
                const toElement = document.getElementsByClassName(childIndex.toString())[0];

                const fromY = fromElement ? fromElement.getBoundingClientRect().bottom - containerRect.top + window.scrollY : 0;
                const toY = toElement ? toElement.getBoundingClientRect().top - containerRect.top + window.scrollY : 0;

                const fromX = fromElement ? fromElement.getBoundingClientRect().left - containerRect.left + fromElement.getBoundingClientRect().width / 2 + window.scrollY : 0;
                const toX = toElement ? toElement.getBoundingClientRect().left - containerRect.left + toElement.getBoundingClientRect().width / 2 + window.scrollY : 0;

                const color = (child.isWorkedOut) ? "bg-red-700" : "bg-gray-400"

                const newLine1 = <div className={`z-1 absolute w-1 ${color}`} style={{top:`${fromY - 20}px`,left:`${fromX}px`, height: `${(toY-fromY)/2}px`}}/>
                const newLine2 = <div className={`z-1 absolute h-1 ${color}`} style={{top:`${fromY+((toY-fromY)/2) - 20}px`,left:`${(fromX > toX) ? toX : fromX}px`, width: `${Math.abs(fromX-toX)}px`}}/>
                const newLine3 = <div className={`z-1 absolute w-1 ${color}`} style={{top:`${fromY+((toY-fromY)/2) - 20}px`,left:`${toX}px`, height: `${(toY-fromY)/2 + 6}px`}}/>

                newLines.push(newLine1);
                newLines.push(newLine2);
                newLines.push(newLine3);
            })
        });
        setLines([...newLines]);
    }

    const persistProject = async (data: Detail[]) => {
        if (!project) return;
        setProject({ ...project, data });
        await cardService.updateCard(data, project._id);
    };

    const calculate = async () => {
        if (!project) return;

        setTestTime((prev) => prev + testStep);

        const data: Detail[] = JSON.parse(JSON.stringify(project.data));
        const oilDetail = data.find((detail) => detail.name.includes("мастило") || detail.name.includes("масло"));
        const oilFailed = oilDetail?.isWorkedOut ?? false;

        const getTemplate = (detail: Detail) => findDetailFromList(detail) ?? detail;

        const getTemperatureRange = (detail: Detail) => {
            const name = detail.name.toLowerCase();
            if (name.includes("акамулятор")) {
                return { min: -35, max: 45, hardMin: -35, hardMax: 45 };
            }
            if (name.includes("мастило") || name.includes("масло")) {
                return { min: -37, max: 160, hardMin: -37, hardMax: 160 };
            }
            return { min: -37, max: 129, hardMin: -37, hardMax: 129 };
        };

        const getTemperatureFactor = (detail: Detail) => {
            const { min, max } = getTemperatureRange(detail);
            if (temperature >= min && temperature <= max) return 1;
            const delta = temperature < min ? min - temperature : temperature - max;
            let factor = 1 + delta * 0.02;
            if (delta >= 20) factor += 0.3;
            return factor;
        };

        const getVoltageFactor = (detail: Detail) => {
            if (!detail.voltage || !detail.maxVoltage) return 1;
            if (detail.voltage <= detail.maxVoltage) return 1;
            const over = (detail.voltage - detail.maxVoltage) / detail.maxVoltage;
            return 1 + over * 2;
        };

        const getRpmFactor = (detail: Detail) => {
            if (!detail.rpm) return 1;
            const template = getTemplate(detail);
            const nominal = template.rpm ?? detail.rpm;
            if (!nominal) return 1;
            if (detail.rpm <= nominal) return 1;
            return 1 + ((detail.rpm - nominal) / nominal) * 1.5;
        };

        const getDetailMultiplier = (detail: Detail) => {
            const map: Record<string, number> = {
                "двигун внутрішнього згорання": 1.4,
                "електродвигун": 1.2,
                "коробка передач": 1.3,
                "поршень": 1.25,
                "циліндр": 1.2,
                "колінвал": 1.2,
                "маховик": 1.1,
                "клапан": 1.1,
                "свічка запалювання": 1.05,
                "акамулятор": 1.1,
                "кардан": 1.05
            };
            return map[detail.name] ?? 1;
        };

        for (let step = 0; step < testStep; step++) {
            data.forEach((detail, index) => {
                const tempFactor = getTemperatureFactor(detail);
                const rpmFactor = getRpmFactor(detail);
                const voltageFactor = getVoltageFactor(detail);
                const lubeFactor = oilFailed ? 1.4 : 1;
                const detailFactor = getDetailMultiplier(detail);

                const wearIncrement = load * tempFactor * rpmFactor * voltageFactor * lubeFactor * detailFactor;
                data[index] = { ...detail, hoursUsed: detail.hoursUsed + wearIncrement };
            });
        }

        data.forEach((detail, index) => {
            let current = data[index];

            const lowerName = current.name.toLowerCase();
            const isOil = lowerName.includes("мастило") || lowerName.includes("масло");
            const isBattery = lowerName.includes("акамулятор");

            if (isOil || isBattery) {
                const { hardMin, hardMax } = getTemperatureRange(current);
                if (temperature < hardMin || temperature > hardMax) {
                    current = { ...current, isWorkedOut: true };
                    data[index] = current;
                }
            }

            if (current.hoursUsed >= current.durability) {
                current = { ...current, isWorkedOut: true };
                data[index] = current;
            }

            if (current.isWorkedOut) {
                const children = data.filter((currentDetail) => currentDetail.parentIndex === index);
                children.forEach((child) => {
                    const childIndex = data.indexOf(child);
                    if (current.name === "двигун внутрішнього згорання") {
                        if (child.name === "поршень" || child.name === "циліндр" || child.name === "колінвал" || child.name === "маховик" || child.name === "кривошип" || child.name === "важіль" || child.name === "клапан" || child.name === "свічка запалювання" || child.name === "коробка передач") {
                            data[childIndex] = { ...child, isWorkedOut: true };
                        }
                    } else {
                        data[childIndex] = { ...child, isWorkedOut: true };
                    }
                });
            }
        });

        data.forEach((detail, index) => {
            const newCoef = (detail.isWorkedOut) ? 0 : 100 - ((detail.hoursUsed / detail.durability) * 100);
            data[index] = { ...detail, workCoef: (newCoef < 0) ? 0 : newCoef };
        });

        await persistProject(data);
    }

    const findDetailFromList = (detail: Detail) => {
        if (detail.parentIndex !== undefined) return project?.data[detail.parentIndex].allowedChildren?.filter((candidate: Detail) => candidate.name === detail.name)[0];
        else return DetailsList.filter((candidate: Detail) => candidate.name === detail.name)[0];
    }

    const repairHandler = async (detail: Detail) => {
        if (!project) return;
        const detailIndex = project.data.indexOf(detail);
        const detailFromList = findDetailFromList(detail);
        const data: Detail[] = JSON.parse(JSON.stringify(project.data));
        data[detailIndex] = { ...detailFromList!, parentIndex: detail.parentIndex };
        await persistProject(data);
    }

    const repairAllHandler = async () => {
        if (!project) return;
        const data: Detail[] = JSON.parse(JSON.stringify(project.data));
        project.data.forEach((detail, index) => {
            const detailFromList = findDetailFromList(detail);
            data[index] = { ...detailFromList!, parentIndex: detail.parentIndex };
        });
        await persistProject(data);
    }

    if(project) return <div
        className="relative flex min-h-screen"
        style={{
            backgroundImage:
                "radial-gradient(circle at 12% 10%, rgba(14, 165, 233, 0.25), transparent 45%), radial-gradient(circle at 85% 20%, rgba(34, 197, 94, 0.22), transparent 50%), radial-gradient(circle at 30% 85%, rgba(245, 158, 11, 0.18), transparent 45%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 40%, #fefce8 100%)"
        }}
    >
        <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px"
            }}
        />
        <div className="overflow-auto grow">
            <div className="h-screen p-4 relative line-container">
                <div className="absolute w-full h-full">
                    {renderDetailWithChildren(project.data[0])}
                    {lines}
                </div>
            </div>
        </div>
        <div className="z-20 bg-gray-100 border-l-2 border-gray-200 shadow-lg h-screen">
            <div className="flex flex-col py-6 px-2 gap-1">
                <div className="flex justify-center">
                    <label className={grayBoldLabelStyle}>Назва проекту:</label> 
                </div>
                <div className="flex justify-center">
                    <label className={largeLabelStyle}>{project?.name}</label>
                </div>
            </div>
            <Separator/>
            <div className="flex flex-col p-6 gap-4">
                <div className="flex flex-col gap-1 justify-center pb-2">
                    <label className={grayBoldLabelStyle}>Навантаження:</label>
                    <select className={selectStyle} value={load} onChange={(e) => setLoad(Number(e.target.value))}>
                        <option value={0.5}>Слабке</option>
                        <option value={1}>Нормальне</option>
                        <option value={1.5}>Перевантаження</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1 justify-center text-center">
                    <div>Температура {temperature}°C</div>
                    <input type="range" min={-40} max={160} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))}/>
                </div>
                <div className="flex flex-col gap-1 justify-center text-center">
                    <div>Загальний час:</div>
                    <div>{testTime} год.</div>
                </div>
                <div className="flex flex-col gap-1">
                    <div>Тривалість тесту (год.):</div>
                    <input min={1} type="number" value={testStep} onChange={(e) => setTestStep(Number(e.target.value))} className={borderedInputStype}/>
                </div>
                <div className="flex flex-col gap-1">
                    <button type="button" onClick={calculate} className={blueButtonStyle}>тест</button>
                </div>
            </div>
            <Separator/>
            <div className="flex flex-col p-6 gap-4">
                <div className="flex justify-center">
                    <button type="button" className={buttonStyle + " w-full"} onClick={repairAllHandler}>замінити всі деталі</button>
                </div>
            </div>
            <Separator/>
            <div className="flex flex-col p-6 gap-4">
                <div className="flex justify-center">
                    <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/project/${project._id}`)}>завершити тестування</button>
                </div>
                <div className="flex justify-center">
                    <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/analysis/${project._id}`)}>аналіз системи</button>
                </div>
                <div className="flex justify-center">
                    <button type="button" className={buttonStyle + " w-full"} onClick={() => navigate(`/recommendations/${project._id}`)}>рекомендації</button>
                </div>
                <div className="flex justify-center ">
                    <button type="button" className={buttonStyle + " w-full"} onClick={handleEscape}>вийти з проекту</button>
                </div>
            </div>
        </div>
        <ConfirmModal
            isOpen={showExitConfirm}
            title="Вийти з проекту"
            message="Увага! Якщо ви не зберегли проект, при виході з проекту зміни будуть втрачені"
            onConfirm={confirmExit}
            onCancel={() => setShowExitConfirm(false)}
            confirmText="Вийти"
        />
    </div>
    else return <LoadingScreen/>
}

export default TestingPage;