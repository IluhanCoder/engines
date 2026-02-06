import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-48 -left-12 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="flex flex-col gap-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Система моніторингу та аналізу стану технічних систем
              </h1>
              <p className="text-slate-200 mt-4">
                Платформа допомагає збирати дані, виявляти відхилення та формувати рекомендації для
                обслуговування. Зручні аналітичні модулі й історія змін дають змогу контролювати стан
                технічних систем у режимі реального часу.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  className="px-5 py-2 rounded bg-white text-slate-900 hover:bg-slate-100"
                  onClick={() => navigate("/login")}
                >
                  Авторизація
                </button>
                <button
                  className="px-5 py-2 rounded border border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/registration")}
                >
                  Реєстрація
                </button>
              </div>
            </div>
            <div className="w-full md:w-[360px]">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                alt="Аналітика та моніторинг"
                className="w-full h-56 object-cover rounded-xl border border-slate-200 shadow-sm"
                loading="lazy"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              title="Збір та візуалізація даних"
              text="Дані з датчиків та журналів об'єднуються в єдину панель для швидкої оцінки стану."
            />
            <FeatureCard
              title="Аналітика та виявлення ризиків"
              text="Алгоритми аналізують тренди, фіксують аномалії та сигналізують про потенційні збої."
            />
            <FeatureCard
              title="Рекомендації з обслуговування"
              text="Система формує список пріоритетних робіт для підтримки надійності обладнання."
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Навіщо аналіз стану технічних систем</h2>
              <p className="text-slate-600 mt-3">
                Регулярний аналіз дозволяє зменшити аварійність, оптимізувати витрати на ремонт
                та планувати обслуговування без простоїв. Це особливо важливо для складних механізмів,
                де відмова одного вузла може вплинути на всю систему.
              </p>
              <ul className="list-disc pl-5 mt-4 text-slate-700 space-y-2">
                <li>Зменшення ризику непередбачених поломок.</li>
                <li>Підвищення ресурсу обладнання.</li>
                <li>Прозора історія змін та рішень.</li>
                <li>Контроль ключових показників у динаміці.</li>
              </ul>
            </div>
            <div className="grid grid-rows-2 gap-6">
              <img
                src="https://www.motor-sense.co.uk/wp-content/uploads/2019/02/Car-diagnostic-Worthing.jpg"
                alt="Моніторинг технічних систем"
                className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm"
                loading="lazy"
              />
              <img
                src="https://blog.napacanada.com/wp-content/uploads/2020/02/shutterstock_118548643-scaled.jpg"
                alt="Стан систем та метрики"
                className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm"
                loading="lazy"
              />
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xl font-semibold">Готові розпочати?</div>
              <div className="text-slate-200 mt-1">Увійдіть або створіть обліковий запис, щоб отримати доступ до проєктів.</div>
            </div>
            <div className="flex gap-3">
              <button
                className="px-5 py-2 rounded bg-white text-slate-900 hover:bg-slate-100"
                onClick={() => navigate("/login")}
              >
                Увійти
              </button>
              <button
                className="px-5 py-2 rounded border border-white text-white hover:bg-slate-800"
                onClick={() => navigate("/registration")}
              >
                Зареєструватись
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, text }: { title: string; text: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
    <div className="font-semibold text-slate-900">{title}</div>
    <div className="text-slate-600 mt-2">{text}</div>
  </div>
);

export default HomePage;
