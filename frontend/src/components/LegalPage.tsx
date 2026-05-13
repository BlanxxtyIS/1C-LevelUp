import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import StarField from './StarField'

interface Props {
  onBack: () => void
}

export default function LegalPage({ onBack }: Props) {
  return (
    <div className="min-h-screen relative" style={{ background: '#0f0f1a' }}>
      <StarField />
      <div className="relative px-6 pt-8 pb-16 max-w-2xl mx-auto" style={{ zIndex: 1 }}>

        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Правовая информация</h1>
        </div>

        {/* Реквизиты */}
        <motion.div
          className="rounded-2xl p-6 border border-slate-800 mb-6"
          style={{ background: '#1a1a2e' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-white font-bold text-lg mb-4">Реквизиты</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Исполнитель</span>
              <span className="text-white">Хасанов Марат Ильдарович</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Статус</span>
              <span className="text-white">Самозанятый</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ИНН</span>
              <span className="text-white">165051909394</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">mvtvr21@mail.ru</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Телефон</span>
              <span className="text-white">+7 927 423-25-05</span>
            </div>
          </div>
        </motion.div>

        {/* Описание услуги */}
        <motion.div
          className="rounded-2xl p-6 border border-slate-800 mb-6"
          style={{ background: '#1a1a2e' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-white font-bold text-lg mb-4">Описание услуги</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            <strong className="text-white">1C LevelUp</strong> — онлайн-платформа для изучения системы 1С:Предприятие в игровом формате.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              <p className="text-slate-300 text-sm"><strong className="text-white">Бесплатный доступ:</strong> до 100 XP — полный доступ ко всем функциям платформы.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              <p className="text-slate-300 text-sm"><strong className="text-white">Подписка Pro (250 ₽/месяц):</strong> неограниченный доступ ко всем урокам, курсам и материалам платформы.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">→</span>
              <p className="text-slate-300 text-sm"><strong className="text-white">Способ получения:</strong> доступ предоставляется немедленно после оплаты в личном кабинете на сайте.</p>
            </div>
          </div>
        </motion.div>

        {/* Оферта */}
        <motion.div
          className="rounded-2xl p-6 border border-slate-800 mb-6"
          style={{ background: '#1a1a2e' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white font-bold text-lg mb-4">Публичная оферта</h2>
          <div className="flex flex-col gap-4 text-sm text-slate-300 leading-relaxed">
            <div>
              <p className="text-white font-semibold mb-1">1. Общие положения</p>
              <p>Настоящий документ является публичной офертой самозанятого Хасанова Марата Ильдаровича (ИНН 165051909394) на оказание услуг доступа к образовательной платформе 1C LevelUp, расположенной по адресу 1-c-level-up.vercel.app.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">2. Предмет договора</p>
              <p>Исполнитель предоставляет Пользователю доступ к образовательным материалам платформы 1C LevelUp на условиях подписки сроком 30 календарных дней с момента оплаты.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">3. Стоимость и порядок оплаты</p>
              <p>Стоимость подписки составляет 250 (двести пятьдесят) рублей в месяц. Оплата производится через платёжный сервис ЮКасса. Подписка не продлевается автоматически.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">4. Порядок предоставления услуги</p>
              <p>Доступ к полному функционалу платформы предоставляется автоматически в течение 5 минут после подтверждения оплаты. Доступ осуществляется через личный кабинет на сайте.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">5. Возврат денежных средств</p>
              <p>Возврат денежных средств осуществляется в течение 3 рабочих дней с момента обращения, если услуга не была оказана по вине Исполнителя. Для возврата обратитесь по email: mvtvr21@mail.ru</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">6. Ответственность сторон</p>
              <p>Исполнитель обязуется обеспечить доступность платформы не менее 95% времени в месяц. Исполнитель не несёт ответственности за перебои в работе, вызванные действиями третьих лиц.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">7. Акцепт оферты</p>
              <p>Оплата услуг является акцептом настоящей оферты и означает полное согласие Пользователя с её условиями.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">8. Контакты</p>
              <p>По всем вопросам: mvtvr21@mail.ru, +7 927 423-25-05</p>
            </div>
          </div>
        </motion.div>

        {/* Политика конфиденциальности */}
        <motion.div
          className="rounded-2xl p-6 border border-slate-800"
          style={{ background: '#1a1a2e' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-white font-bold text-lg mb-4">Политика конфиденциальности</h2>
          <div className="flex flex-col gap-4 text-sm text-slate-300 leading-relaxed">
            <div>
              <p className="text-white font-semibold mb-1">Какие данные мы собираем</p>
              <p>Имя пользователя, email адрес, прогресс обучения. Платёжные данные не хранятся на наших серверах — они обрабатываются ЮКасса.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Как мы используем данные</p>
              <p>Данные используются исключительно для обеспечения работы платформы и не передаются третьим лицам.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Удаление данных</p>
              <p>По запросу на mvtvr21@mail.ru ваши данные будут удалены в течение 7 рабочих дней.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}