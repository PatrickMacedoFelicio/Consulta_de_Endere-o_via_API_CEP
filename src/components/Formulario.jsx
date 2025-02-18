import React, { useState } from "react";
import "../styles/Formulario.css";

const Formulario = () => {
  const [formData, setFormData] = useState({
    cep: "",
    endereco: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarCep = () => {
    const { cep } = formData;
    if (cep.length === 8) {
      buscarEnderecoPorCep(cep);
    } else {
      setErrors({ ...errors, cep: "CEP inválido. Deve ter 8 dígitos." });
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    setLoadingCep(true); 
    setErrors({ ...errors, cep: "" });

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErrors({ ...errors, cep: "CEP não encontrado." });
      } else {
        setFormData({
          ...formData,
          endereco: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        });
      }
    } catch (error) {
      setErrors({ ...errors, cep: "Erro ao buscar o CEP. Tente novamente." });
    } finally {
      setLoadingCep(false); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novosErros = {};

    if (!formData.cep || formData.cep.length !== 8) {
      novosErros.cep = "CEP inválido.";
    }

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      alert("Formulário enviado com sucesso!");
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Insira seu CEP</h2>
      <div>
        <label>CEP:</label>
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="XXXXX-XXX"
          maxLength={8}
        />
                {loadingCep && <span>Carregando...</span>}
        {errors.cep && <span style={{ color: "red" }}>{errors.cep}</span>}
        <button type="button" onClick={validarCep}>
          Validar CEP
        </button>
      </div>
      <h2>Endereço</h2>
      <div>
        <label>Endereço:</label>
        <input
          type="text"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Complemento:</label>
        <input
          type="text"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bairro:</label>
        <input
          type="text"
          name="bairro"
          value={formData.bairro}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cidade:</label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estado:</label>
        <input
          type="text"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
