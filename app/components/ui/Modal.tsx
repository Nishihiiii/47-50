import type { ReactNode } from "react"; // импортируем тип для содержимого компонента из реакта

interface ModalProps {
  isOpen: boolean;       // флаг, который говорит, открыто ли окно в данный момент
  onClose: () => void;   // функция, которая срабатывает при закрытии окна
  children: ReactNode;   // то, что будет показываться внутри самого окна
  title: string;         // текстовый заголовок для верха окошка
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) { // создаем функцию окна и принимаем его свойства
  if (!isOpen) return null; // если окно не должно быть открыто, просто ничего не выводим на экран

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"> {/* главный контейнер, который растягивается на весь экран и центрует окно */}
      <div
        className="absolute inset-0 bg-black/50" // это темный полупрозрачный фон за модальным окном
        onClick={onClose}                        // если кликнуть по этому темному фону, окно закроется
      />

      <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"> {/* сама белая карточка модального окна со скруглениями и тенями */}
        <div className="flex justify-between items-center mb-4"> {/* верхняя панель, где заголовок и кнопка закрытия разнесены по бокам */}
          <h2 className="text-xl font-bold">{title}</h2> {/* выводим жирный текст заголовка */}
          <button
            onClick={onClose} // вешаем закрытие окна на клик по крестику
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none" // стили для крестика, чтобы он менял цвет при наведении
          >
            🗙 
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
