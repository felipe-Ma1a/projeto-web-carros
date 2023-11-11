import { useState, useEffect, useContext } from "react";

import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../services/firebaseConnection";

import { Container } from "../../components/container";

import { FiTrash2, FiEdit } from "react-icons/fi";

interface CarsProps {
  id: string;
  name: string;
  year: string;
  km: string;
  city: string;
  price: string | number;
  images: CarsImageProps[];
  uid: string;
}

interface CarsImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    function loadCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user?.uid));

      getDocs(queryRef).then((snapshot) => {
        const listCars = [] as CarsProps[];

        snapshot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setCars(listCars);
      });
    }

    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarsProps) {
    const docRef = doc(db, "cars", car.id);
    await deleteDoc(docRef);

    car.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      await deleteObject(imageRef);
    });

    const deleteCar = cars.filter((item) => item.id !== car.id);
    setCars(deleteCar);
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  return (
    <Container>
      <h1 className="mb-4 mt-6 text-center text-2xl font-bold">Meus Carros</h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section
            key={car.id}
            className="relative w-full rounded-lg bg-zinc-200"
          >
            <div
              className="h-72 w-full rounded-lg bg-zinc-200"
              style={{
                display: loadImages.includes(car.id) ? "none" : "block",
              }}
            ></div>
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute right-2 top-2 flex h-14 w-14 items-center justify-center rounded-full bg-white"
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <Link to={`/dashboard/edit/${car.id}`}>
              <button className="absolute right-2 top-20 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <FiEdit size={26} color="#000" />
              </button>
            </Link>
            <img
              className="mb-2 max-h-72 w-full rounded-lg"
              src={car.images[0].url}
              alt={car.name}
              onLoad={() => handleImageLoad(car.id)}
              style={{
                display: loadImages.includes(car.id) ? "block" : "none",
              }}
            />
            <p className="mb-2 mt-1 px-2 font-bold">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Ano {car.year} | {car.km} km
              </span>
              <strong className="mt-4 text-xl font-bold text-black">
                R$ {car.price}
              </strong>
            </div>

            <div className="my-2 h-px w-full bg-gray-300"></div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
