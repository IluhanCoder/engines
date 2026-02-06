import { useNavigate } from "react-router-dom";

const EngineInfoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Двигуни внутрішнього згоряння</h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Короткий довідник про конструкцію, принцип роботи та базові схеми ремонту.
                Матеріал загальний і підходить для ознайомлення та навчальних проєктів.
              </p>
            </div>
            <button
              className="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => navigate("/")}
            >
              На головну
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Загальна будова</h2>
              <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-2">
                <li>Блок циліндрів, поршні, шатуни та колінчастий вал.</li>
                <li>Газорозподільний механізм: клапани, розподільний вал.</li>
                <li>Система впуску/випуску, паливна та запалювання.</li>
                <li>Системи змащення та охолодження для стабільної роботи.</li>
              </ul>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Принцип роботи</h2>
              <ol className="list-decimal pl-5 mt-3 text-slate-700 space-y-2">
                <li>Впуск: циліндр наповнюється паливно-повітряною сумішшю.</li>
                <li>Стиснення: поршень стискає суміш.</li>
                <li>Робочий хід: згоряння створює тиск і обертає вал.</li>
                <li>Випуск: відпрацьовані гази виводяться назовні.</li>
              </ol>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Типи двигунів</h2>
              <p className="text-slate-600 mt-2">
                Найпоширеніші варіанти: бензинові, дизельні, газові та гібридні ДВЗ.
                Відрізняються системою запалювання, паливоподачі та режимами роботи.
              </p>
              <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-2">
                <li>Бензинові — простіші та легші, добре працюють на високих обертах.</li>
                <li>Дизельні — економніші, з високим крутним моментом.</li>
                <li>Гібридні — поєднання ДВЗ та електроприводу.</li>
              </ul>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Системи двигуна</h2>
              <p className="text-slate-600 mt-2">
                Узгоджена робота кількох систем забезпечує потужність, ресурс і екологічні показники.
              </p>
              <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-2">
                <li>Паливна: подача, фільтрація, форсунки або карбюратор.</li>
                <li>Запалювання: котушки, свічки, датчики положення валів.</li>
                <li>Змащення: насос, канали, фільтр, контроль тиску.</li>
                <li>Охолодження: радіатор, помпа, термостат, вентилятор.</li>
              </ul>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Основні параметри</h2>
              <p className="text-slate-600 mt-2">
                Ефективність двигуна оцінюють через потужність, крутний момент і робочий об'єм.
              </p>
              <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-2">
                <li>Робочий об'єм — сумарний об'єм циліндрів.</li>
                <li>Ступінь стиснення — впливає на ККД та витрати пального.</li>
                <li>Крутний момент — тягові можливості.</li>
                <li>Потужність — швидкісні можливості.</li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Схема конструкції (одноциліндровий ДВЗ)</h2>
              <p className="text-slate-600 mt-2">
                На зображенні показані базові елементи одноциліндрового двигуна: циліндр, поршень, шатун,
                колінчастий вал, впуск та випуск. Така схема добре ілюструє загальний принцип роботи.
              </p>
              <div className="mt-4">
                <img
                  src="https://green-way.com.ua/storage/app/media/Yulya/ustrojstvo-avtomobilja/dvigatel/odnocilindrovyj-dvigatel-vnutrennego-sgoranija-ua.png"
                  alt="Схема одноциліндрового двигуна внутрішнього згоряння"
                  className="w-full h-auto rounded-lg border border-slate-200"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Схема ремонту та обслуговування</h2>
              <p className="text-slate-600 mt-2">
                Приклад структурованої схеми з вузлами та етапами контролю — зручно для навчального огляду
                послідовності робіт і контролю стану.
              </p>
              <div className="mt-4">
                <img
                  src="https://elib.tsatu.edu.ua/dep/mtf/ophv_9/user-files/image032.png"
                  alt="Схема ремонту та обслуговування двигуна"
                  className="w-full h-auto rounded-lg border border-slate-200 bg-white"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900">Типові несправності та ознаки</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800">Перегрів</div>
                <p className="text-slate-600 mt-1">
                  Нестача охолоджувальної рідини, несправність термостата або помпи.
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800">Підвищена витрата масла</div>
                <p className="text-slate-600 mt-1">
                  Знос поршневих кілець або ущільнень клапанів.
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800">Вібрації/стукіт</div>
                <p className="text-slate-600 mt-1">
                  Дисбаланс колінчастого валу або знос вкладишів.
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800">Втрата потужності</div>
                <p className="text-slate-600 mt-1">
                  Проблеми з паливною системою, запалюванням або компресією.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Ознаки зносу та діагностика</h2>
              <p className="text-slate-600 mt-2">
                Первинну діагностику можна провести без розбирання — за звуком, димністю та показниками датчиків.
              </p>
              <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-2">
                <li>Компресія в циліндрах — показник стану циліндро-поршневої групи.</li>
                <li>Колір вихлопу: синій — масло, чорний — багата суміш, білий — охолоджувальна рідина.</li>
                <li>Нестійкі оберти — можливі підсмоктування повітря або проблеми запалювання.</li>
                <li>Помилки ЕБУ — допомагають локалізувати несправність.</li>
              </ul>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900">Обслуговування</h2>
              <p className="text-slate-600 mt-2">
                Регулярне ТО значно продовжує ресурс двигуна та зменшує ризик дорогого ремонту.
              </p>
              <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-2">
                <li>Заміна масла і фільтрів за регламентом.</li>
                <li>Контроль рівня охолоджувальної рідини та стану ременів.</li>
                <li>Перевірка свічок/форсунок, очищення дроселя.</li>
                <li>Періодична перевірка герметичності та підтікання.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineInfoPage;
