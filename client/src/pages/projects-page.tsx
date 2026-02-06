import { observer } from "mobx-react-lite";
import userStore from "../stores/userStore";
import { useEffect, useState } from "react";
import Project from "../types/project-type";
import cardService from "../services/card-service";
import buttonStyle, { blueButtonStyle } from "../styles/button-style";
import DetailsList from "../static/details-list";
import { useNavigate } from "react-router-dom";
import currentProjectStore from "../stores/currentProjectStore";
import DateFormater from "../misc/date-formatter";
import { grayBoldLabelStyle, largeLabelStyle, lightBoldLabelStyle } from "../styles/label-style";
import LoadingScreen from "../components/loading-screen";
import userService from "../services/user-service";
import PromptModal from "../components/prompt-modal";

const ProjectsPage = () => {
    const userId = userStore.user?._id;
    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]|undefined>();
    const [showPrompt, setShowPrompt] = useState(false);

    const fetchProjects = async () => {
        if(!userId) {
            return;
        }
        const res = await cardService.fetchUserCards(userId!);
        setProjects([...res.data]);
    }

    const logoutHandler = async () => {
        try {
            await userService.logout();
            navigate("/login");
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {fetchProjects()}, [userId]);

    const handleNewProject = async () => {
        setShowPrompt(true);
    }

    const createProject = async (projectName: string) => {
        try {
            const defaultDetails = [DetailsList[0]];
            const res = await cardService.createCard(defaultDetails, projectName);
            const newCardId = res.card._id;
            setShowPrompt(false);
            navigate(`/project/${newCardId}`);
        } catch (error) {
            throw error;
        }
    }

    const handleOpenProject = (projectId: string) => {
        navigate(`/project/${projectId}`)
    };

    if(projects) return <div className="flex flex-col w-full h-screen">
        <div className="px-6 pt-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">Інформаційна сторінка про двигуни</div>
                        <div className="text-slate-600 mt-2 max-w-2xl">
                            Загальна будова, принцип роботи, типові несправності та схеми ремонту —
                            компактний довідник з наочними схемами.
                        </div>
                    </div>
                    <button className={blueButtonStyle} onClick={() => navigate("/engines")}>відкрити</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4">
                        <img
                            src="https://green-way.com.ua/storage/app/media/Yulya/ustrojstvo-avtomobilja/dvigatel/odnocilindrovyj-dvigatel-vnutrennego-sgoranija-ua.png"
                            alt="Схема одноциліндрового двигуна"
                            className="w-24 h-16 object-contain rounded border border-slate-200 bg-white"
                            loading="lazy"
                        />
                        <div>
                            <div className="font-semibold text-slate-800">Схема конструкції</div>
                            <div className="text-slate-600 text-sm">Основні вузли та зв'язки між ними.</div>
                        </div>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4">
                        <img
                            src="https://elib.tsatu.edu.ua/dep/mtf/ophv_9/user-files/image032.png"
                            alt="Схема ремонту та обслуговування двигуна"
                            className="w-24 h-16 object-contain rounded border border-slate-200 bg-white"
                            loading="lazy"
                        />
                        <div>
                            <div className="font-semibold text-slate-800">Схема ремонту</div>
                            <div className="text-slate-600 text-sm">Діагностика → дефектація → заміна → збірка.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={"flex justify-center pt-6 " + largeLabelStyle}>
            Ваші проекти:
        </div>
        {projects.length > 0 && <div className="py-5 h-4/5 ">
            <div className="grid bg-gray-100 rounded grid-cols-3 text-center font-bold py-1">
                        <div>назва</div>
                        <div>дата створення</div>
                        <div>останні зміни</div>
            </div>
            <div className="overflow-auto">
                <div className="grid grid-cols-1 px-6 mt-2 w-full gap-2">
                {
                    projects.map((project: Project) => {
                        return <div className="flex border-b border-gray-200 px-4 py-2">
                            <div className="grid grid-cols-3 w-full">
                                <div className="flex justify-center">
                                    {project.name}
                                </div>
                                <div className={"text-center " + lightBoldLabelStyle}>
                                    <DateFormater value={project.creationTime}/>
                                </div>
                                <div className={"text-center " + lightBoldLabelStyle}>
                                    <DateFormater value={project.lastChangesTime}/>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2">
                                <button type="button" className={buttonStyle} onClick={() => handleOpenProject(project._id)}>відкрити</button>
                                <button type="button" className={buttonStyle} onClick={() => navigate(`/analysis/${project._id}`)}>аналіз</button>
                            </div>
                        </div>
                    })
                }
                </div>  
            </div>
        </div> ||
        <div className="flex justify-center w-full h-4/5">
            <div className={"flex justify-center pt-56 " + grayBoldLabelStyle}>
                У вас нема проектів
            </div>
        </div>
        }
        <div className="flex justify-center">
            <button className={blueButtonStyle} onClick={handleNewProject}>створити проект</button>
        </div>
        <div className="absolute left-2 bottom-2">
            <button className={buttonStyle} onClick={logoutHandler}>Вийти з облікового запису</button>
        </div>
        <PromptModal
            isOpen={showPrompt}
            title="Новий проект"
            message="Введіть назву проекту:"
            defaultValue="без назви"
            onConfirm={createProject}
            onCancel={() => setShowPrompt(false)}
            placeholder="Назва проекту"
        />
    </div>
    else return <LoadingScreen/>
}

export default observer(ProjectsPage);