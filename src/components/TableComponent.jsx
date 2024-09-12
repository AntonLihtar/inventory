// TableComponent.js
import {useState, useEffect, useRef} from 'react';
import {db} from '../firebase';
import {collection, addDoc, onSnapshot} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import TableRow from './TableRow';

const storage = getStorage(); // Инициализация Firebase Storage

const Block = ({items}) => {
    return (
        <div className="block">
            {items.map((item) => (
                <TableRow key={item.id} item={item}/>
            ))}
        </div>
    )
}

const TableComponent = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        imageFile: null,
        state: 'дома',
    });
    const fileInputRef = useRef(null); // Используется для очистки input type="file"

    // Загрузка данных из Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setItems(data);
        });

        return () => unsubscribe();
    }, []);

    // Функция для добавления новой строки в базу данных
    const addItem = async (e) => {
        e.preventDefault();
        if (!newItem.name.trim() || !newItem.imageFile) {
            alert('Пожалуйста, заполните все поля и загрузите изображение.');
            return;
        }

        try {
            // Загрузка изображения в Firebase Storage
            const imageRef = ref(storage, `images/${newItem.imageFile.name}`);
            await uploadBytes(imageRef, newItem.imageFile);

            // Получение URL загруженного изображения
            const imageUrl = await getDownloadURL(imageRef);

            // Добавление данных в Firestore
            await addDoc(collection(db, 'items'), {
                name: newItem.name,
                image: imageUrl,
                state: newItem.state,
                date: new Date().toLocaleString(), // Обновление: сохранение даты и времени
            });

            // Очистка полей ввода после добавления
            setNewItem({name: '', imageFile: null, state: 'дома'});
            fileInputRef.current.value = null; // Очистка input type="file"
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            alert('Произошла ошибка при добавлении вещи.');
        }
    };

    // Обработчик для изменения значений полей ввода
    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'imageFile') {
            setNewItem((prev) => ({...prev, imageFile: files[0]}));
        } else {
            setNewItem((prev) => ({...prev, [name]: value}));
        }
    };

    // Сортировка элементов: сначала с 'садик', затем по дате
    const sortedItems = [...items].sort((a, b) => {
        // Сортировка по state: 'садик' идет первее
        if (a.state === 'садик' && b.state !== 'садик') return -1;
        if (a.state !== 'садик' && b.state === 'садик') return 1;

        return a.name.localeCompare(b.name); // Сортировка по названию (по алфавиту)
    });

    const sadItems = sortedItems.filter(el => el.state === 'садик')
    const homeItems = sortedItems.filter(el => el.state === 'дома')

    const popularItems = homeItems.filter(({name}) => {
        return name.includes('футболка')
            || name.includes('штаны')
            || name.includes('леггинсы')
    })

    const otherItems = homeItems.filter(({name}) => {
        return !name.includes('футболка')
            && !name.includes('штаны')
            && !name.includes('леггинсы')
    })

    return (
        <div className="Container">
            <h2>В садике</h2>
            <Block items={sadItems}/>
            <h2>Дома</h2>
            <Block items={popularItems}/>
            <Block items={otherItems}/>


            {/* Форма для добавления новой строки */}
            <h3>Добавить вещь</h3>

            <form onSubmit={addItem}>
                <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleInputChange}
                    ref={fileInputRef} // Привязка ref к input type="file"
                    required
                />
                <input
                    className="inputText"
                    type="text"
                    name="name"
                    placeholder="Название вещи"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit" style={{padding: '5px 10px'}}>
                    добавить
                </button>
            </form>
        </div>
    );
};

export default TableComponent;
