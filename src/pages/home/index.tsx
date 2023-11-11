import { useState, useEffect, useContext, KeyboardEvent } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import { Link } from "react-router-dom";

import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Container } from "../../components/container";

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

export function Home() {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

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

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCar() {
    if (input === "") {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    let listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
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
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchCar();
    }
  };

  return (
    <div>
      <Container>
        <section className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-lg">
          <input
            className="h-9 w-full rounded-lg border-2 px-3 outline-none"
            placeholder="Digite o nome do carro..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="h-9 rounded-lg bg-red-500 px-8 text-lg font-medium text-white"
            onClick={handleSearchCar}
          >
            Buscar
          </button>
        </section>

        <h1 className="mb-4 mt-6 text-center text-2xl font-bold">
          Carros novos e usados em todo o Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Link key={car.id} to={`/car/${car.id}`}>
              <section className="w-full rounded-lg bg-zinc-200">
                <div
                  className="h-72 w-full rounded-lg bg-zinc-200"
                  style={{
                    display: loadImages.includes(car.id) ? "none" : "block",
                  }}
                ></div>
                <img
                  className="mb-2 max-h-72 w-full cursor-pointer rounded-lg transition-all hover:scale-105"
                  src={car.images[0].url}
                  alt={car.name}
                  onLoad={() => handleImageLoad(car.id)}
                  style={{
                    display: loadImages.includes(car.id) ? "block" : "none",
                  }}
                />
                <div className="flex justify-between items-center px-2 font-bold">
                  <p className="mb-2 mt-1 ">{car.name}</p>
                  {car.uid === user?.uid && (
                    <span className="bg-red-500 text-white rounded-lg px-2">
                      Seu Anuncio
                    </span>
                  )}
                </div>

                <div className="flex flex-col px-2">
                  <span className="mb-6 text-zinc-700">
                    Ano {car.year} | {car.km} km
                  </span>
                  <strong className="text-xl font-medium text-black">
                    R$ {car.price}
                  </strong>
                </div>

                <div className="my-2 h-px w-full bg-gray-300"></div>

                <div className="px-2 pb-2">
                  <span className="text-zinc-700">{car.city}</span>
                </div>
              </section>
            </Link>
          ))}
        </main>
      </Container>
    </div>
  );
}
