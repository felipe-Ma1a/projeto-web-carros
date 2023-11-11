import { Link } from "react-router-dom";

import { Container } from "../../../components/container";

export function EditCar() {
  return (
    <Container>
      <div className="flex flex-col w-full min-h-screen justify-center items-center text-black">
        <h1 className="font-bold text-4xl mb-4">Em desenvolvimento</h1>
        <Link
          className="bg-red-500 text-white py-1 px-4 rounded-md hover:opacity-90 transition-opacity"
          to="/"
        >
          Voltar para home
        </Link>
      </div>
    </Container>
  );
}
