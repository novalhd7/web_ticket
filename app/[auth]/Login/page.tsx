import FormLogin from "@/components/auth/form-login";

const Login = () => {
  return (
    <div className="pt-20">
      <div className="p-6 space-y-4 pt-20 max-w-md mx-auto bg-gray-300 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Buat Akun
        </h1>
        <FormLogin />
      </div>
    </div>
  );
};

export default Login;
