// импортируем нужные типы для кнопок из библиотеки реакт
import type { ButtonHTMLAttributes, ReactNode } from "react";

// создаем описание (интерфейс) для свойств, которые может принимать наша кнопка
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // внутри кнопки может быть любой текст или другие элементы
  children: ReactNode;
  // у кнопки может быть два стиля на выбор: главный или второстепенный
  variant?: "primary" | "secondary";
}

// создаем саму функцию кнопки, которую можно будет использовать в других файлах
export default function Button({
  // достаем внутреннее содержимое кнопки
  children,
  // задаем стиль по умолчанию, если его не указали — будет главный
  variant = "primary",
  // создаем пустую строку для дополнительных классов стилей, если их передадут
  className = "",
  // собираем все остальные стандартные свойства кнопки
  ...props
}: ButtonProps) { // говорим реакту, что эти свойства должны строго соответствовать нашему описанию выше
  // задаем базовые стили для внешнего вида кнопки (отступы, округление, шрифты, анимация)
  const baseClass = "px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50";
  // описываем цвета для каждого из двух вариантов стилей кнопки
  const variants = {
    primary: "bg-tom-thumb-600 text-white hover:bg-tom-thumb-700",
    secondary: "bg-stone-200 text-stone-700 hover:bg-stone-300",
  };

  // возвращаем готовую разметку, которую увидит пользователь на экране
  return (
    <button
      // склеиваем в одну строчку базовые стили, стили выбранного варианта и внешние классы
      className={`${baseClass} ${variants[variant]} ${className}`}
      // передаем кнопке все остальные стандартные свойства, которые мы собрали в начале
      {...props}
    >
      {children}
    </button>
  );
}
