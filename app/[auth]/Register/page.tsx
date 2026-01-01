import FormRegister from "@/components/auth/form-register";

const Register = () => {
  return (
    <div className="p-6 space-y-4 pt-20 max-w-md mx-auto bg-gray-300 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
      <FormRegister />
    </div>
  );
};

export default Register;
