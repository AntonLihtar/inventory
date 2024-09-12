// TableRow.js
import { useState } from 'react';
import { db } from '../firebase';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import cls from './TableRow.module.css';

const TableRow = ({ item }) => {
    const [isImageFullScreen, setIsImageFullScreen] = useState(false); // Состояние для отслеживания полноэкранного режима изображения

    // Функция переключения состояния и обновления даты
    const toggleState = async () => {
        await updateDoc(doc(db, "items", item.id), {
            state: item.state === 'дома' ? 'садик' : 'дома',
            date: new Date().toLocaleString(), // Обновление даты на текущую
        });
    };

    // Функция для удаления элемента
    const deleteItem = async () => {
        if (window.confirm("Вы уверены, что хотите удалить эту строку?")) {
            await deleteDoc(doc(db, "items", item.id));
        }
    };

    // Функция переключения режима изображения
    const toggleImageSize = () => {
        setIsImageFullScreen((prev) => !prev);
    };

    return (
        <div
            className={cls.Card}
            style={{ backgroundColor: item.state === 'дома' ? 'white' : '#704cf3' }}
        >
            <img
                src={item.image}
                alt={item.name}
                className={isImageFullScreen ? cls.FullScreenImage : cls.NormalImage} // Применение класса в зависимости от состояния
                onClick={toggleImageSize} // Переключение полноэкранного режима при клике
            />

            <button onClick={toggleState}>
                {item.state === 'дома' ? 'садик' : 'дома'}
            </button>

            <h5>{item.date}</h5>
            <button onClick={deleteItem} className={cls.delBtn}>
                X
            </button>
        </div>
    );
};

export default TableRow;
