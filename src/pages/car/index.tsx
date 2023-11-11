import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Swiper, SwiperSlide } from "swiper/react";

import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";

interface CarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCar() {
      if (!id) return;

      const docRef = doc(db, "cars", id);
      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          city: snapshot.data()?.city,
          model: snapshot.data()?.model,
          uid: snapshot.data()?.uid,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.whatsapp,
          price: snapshot.data()?.price,
          km: snapshot.data()?.km,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images,
        });
      });
    }

    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleLink(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (car?.uid === user?.uid) {
      e.preventDefault();
    }
  }

  return (
    <div>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img
                className="w-full h-96 object-cover px-2 sm:px-0"
                src={image.url}
                alt={car.name}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <Container>
        {car && (
          <main className="my-4 w-full rounded-lg bg-white p-6">
            <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
              <h1 className="font-bold text-xl min-[376px]:text-3xl text-black">
                {car.name}
              </h1>
              <h2 className="font-bold text-xl min-[376px]:text-3xl text-black">
                R$ {car.price}
              </h2>
            </div>
            <p className="text-center sm:text-left">{car.model}</p>

            <div className="flex w-full my-4 border-b-[1px] border-gray-100">
              <div className="grid grid-cols-2 min-[365px]:flex gap-8 my-4 mx-auto sm:mx-0">
                <div>
                  <p className="flex justify-center min-[426px]:justify-start">
                    Cidade
                  </p>
                  <strong className="flex justify-center">{car.city}</strong>
                </div>
                <div>
                  <p className="flex justify-center min-[426px]:justify-start">
                    Ano
                  </p>
                  <strong className="flex justify-center">{car.year}</strong>
                </div>
                <div>
                  <p className="flex justify-center min-[426px]:justify-start">
                    KM
                  </p>
                  <strong className="flex justify-center">{car.km}</strong>
                </div>
              </div>
            </div>

            <strong>Vendedor(a)</strong>
            <p className="mb-4">{car.owner}</p>

            <strong>Descrição:</strong>
            <p className="mb-4 text-sm min-[365px]:text-base">
              {car.description}
            </p>

            <strong>Telefone / Whatsapp</strong>
            <p>{car.whatsapp}</p>

            <a
              href={`https://api.whatsapp.com/send?phone=${car.whatsapp}&text=Olá, vi esse ${car.name} no site WebCarros e fiquei interessado!`}
              target="_blank"
              className={`bg-green-500 w-full text-white flex items-center justify-center gap-2 mt-6 h-11 text-base min-[365px]:text-xl rounded-lg font-medium cursor-pointer transition-opacity hover:opacity-95 ${
                car?.uid === user?.uid
                  ? "cursor-not-allowed hover:opacity-100"
                  : ""
              }`}
              onClick={handleLink}
            >
              Conversar com vendedor
              <FaWhatsapp size={26} color="#fff" />
            </a>
          </main>
        )}
      </Container>
    </div>
  );
}
