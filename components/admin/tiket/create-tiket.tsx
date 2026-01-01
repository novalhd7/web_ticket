import CreateForm from "./create-form";
import { createCar } from "@/app/admin/dashboard/create/actions";

const CreateTiket = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Tiket</h1>
      <CreateForm action={createCar} />
    </div>
  );
};

export default CreateTiket;
