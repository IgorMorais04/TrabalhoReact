import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function App() {
  const baseUrl = "https://localhost:7026/api/v1/veiculos";

  const [data, setData] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState({
    id: "",
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    cor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVeiculoSelecionado({ ...veiculoSelecionado, [name]: value });
  };

  const abrirFecharModalIncluir = () => setModalIncluir(!modalIncluir);
  const abrirFecharModalEditar = () => setModalEditar(!modalEditar);
  const abrirFecharModalExcluir = () => setModalExcluir(!modalExcluir);

  const obterVeiculos = async () => {
    try {
      const response = await axios.get(baseUrl);
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };

  const adicionarVeiculo = async () => {
    try {
      const { id, ...novoVeiculo } = veiculoSelecionado;
  
      const response = await axios.post(baseUrl, novoVeiculo, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      setData([...data, response.data]);
      abrirFecharModalIncluir();
    } catch (error) {
      console.error("Erro ao adicionar veículo:", error.response?.data || error.message);
    }
  };
  

  const atualizarVeiculo = async () => {
    try {
      await axios.put(`${baseUrl}/${veiculoSelecionado.id}`, veiculoSelecionado, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      setData(
        data.map((veiculo) =>
          veiculo.id === veiculoSelecionado.id ? veiculoSelecionado : veiculo
        )
      );
      abrirFecharModalEditar();
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error.response?.data || error.message);
    }
  };

  const excluirVeiculo = async () => {
    try {
      await axios.delete(`${baseUrl}/${veiculoSelecionado.id}`);
      setData(data.filter((veiculo) => veiculo.id !== veiculoSelecionado.id));
      abrirFecharModalExcluir();
    } catch (error) {
      console.error("Erro ao excluir veículo:", error.response?.data || error.message);
    }
  };

  const selecionarVeiculo = (veiculo, acao) => {
    setVeiculoSelecionado(veiculo);
    if (acao === "Editar") abrirFecharModalEditar();
    else abrirFecharModalExcluir();
  };

  useEffect(() => {
    obterVeiculos();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Cadastro de Veículos</h3>
      <button onClick={abrirFecharModalIncluir} className="btn btn-success">
        Adicionar Veículo
      </button>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Ano</th>
            <th>Cor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>{veiculo.id}</td>
              <td>{veiculo.placa}</td>
              <td>{veiculo.modelo}</td>
              <td>{veiculo.marca}</td>
              <td>{veiculo.ano}</td>
              <td>{veiculo.cor}</td>
              <td>
                <button
                  className="btn btn-primary mx-1"
                  onClick={() => selecionarVeiculo(veiculo, "Editar")}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarVeiculo(veiculo, "Excluir")}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Adicionar */}
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Adicionar Veículo</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Placa:</label>
            <input type="text" className="form-control" name="placa" onChange={handleChange} />
            <label>Modelo:</label>
            <input type="text" className="form-control" name="modelo" onChange={handleChange} />
            <label>Marca:</label>
            <input type="text" className="form-control" name="marca" onChange={handleChange} />
            <label>Ano:</label>
            <input type="number" className="form-control" name="ano" onChange={handleChange} />
            <label>Cor:</label>
            <input type="text" className="form-control" name="cor" onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={adicionarVeiculo}>
            Adicionar
          </button>
          <button className="btn btn-danger" onClick={abrirFecharModalIncluir}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Veículo</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Placa:</label>
            <input type="text" className="form-control" name="placa" onChange={handleChange} value={veiculoSelecionado?.placa || ""} />
            <label>Modelo:</label>
            <input type="text" className="form-control" name="modelo" onChange={handleChange} value={veiculoSelecionado?.modelo || ""} />
            <label>Marca:</label>
            <input type="text" className="form-control" name="marca" onChange={handleChange} value={veiculoSelecionado?.marca || ""} />
            <label>Ano:</label>
            <input type="number" className="form-control" name="ano" onChange={handleChange} value={veiculoSelecionado?.ano || ""} />
            <label>Cor:</label>
            <input type="text" className="form-control" name="cor" onChange={handleChange} value={veiculoSelecionado?.cor || ""} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={atualizarVeiculo}>
            Salvar
          </button>
          <button className="btn btn-danger" onClick={abrirFecharModalEditar}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal Excluir */}
      <Modal isOpen={modalExcluir}>
        <ModalHeader>Excluir Veículo</ModalHeader>
        <ModalBody>Tem certeza que deseja excluir este veículo?</ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={excluirVeiculo}>
            Sim
          </button>
          <button className="btn btn-secondary" onClick={abrirFecharModalExcluir}>
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
