import {db} from '../firebase';
import {updateDoc, deleteDoc, doc} from 'firebase/firestore';
import cls from './TableRow.module.css'

const TableRow = ({item}) => {
    // Функция переключения состояния и обновления даты
    const toggleState = async () => {
        await updateDoc(doc(db, "items", item.id), {
            state: item.state === 'дома' ? 'садик' : 'дома',
            date: new Date().toLocaleString(), // Обновление даты на текущую
        });
    };


    const deleteItem = async () => {
        if (window.confirm("Вы уверены, что хотите удалить эту строку?")) {
            await deleteDoc(doc(db, "items", item.id));
        }
    };

    return (
        <div
            className={cls.Card}
            style={{backgroundColor: item.state === 'дома' ? 'white' : '#704cf3'}}
        >
            <img src={item.image} alt={item.name}/>

            <button
                onClick={toggleState}
            >
                {item.state === 'дома' ? 'садик' : 'дома'}
            </button>
            <h4>
                {item.name}
            </h4>

            <h5>{item.date}</h5>
            <button
                onClick={deleteItem}
                className={cls.delBtn}
            >X</button>
        </div>
    );
};

export default TableRow;
