import api from "./api";

function Connection() {

  const ConnectBackend = async () => {
    try {
      const response = await api.get("/");
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={ConnectBackend}>
      Connect Backend
    </button>
  );
}

export default Connection;