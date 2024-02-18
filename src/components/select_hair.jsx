import Select, { components } from "react-select";
import { IconContext } from "react-icons";
import { FaCircle } from "react-icons/fa";
//import dynamic from "next/dynamic";

const options = [
  {
    value: 723723,
    label: "Preto",
    description: "Um tom muito escuro, quase preto absoluto.",
  },
  {
    value: 3878948,
    label: "Castanho Escuro",
    description: "Uma tonalidade profunda e rica de marrom.",
  },
  {
    value: 6966850,
    label: "Castanho Médio",
    description: "Um marrom equilibrado, nem muito claro nem muito escuro.",
  },
  {
    value: 10978666,
    label: "Castanho Claro",
    description: "Um marrom claro com nuances douradas.",
  },
  {
    value: 12097400,
    label: "Loiro Escuro",
    description: "Um tom de loiro que tende mais para o marrom.",
  },
  {
    value: 14335381,
    label: "Loiro Médio",
    description: "Um loiro nem muito claro nem muito escuro, loiro natural",
  },
  {
    value: 16774625,
    label: "Loiro Claro",
    description: "Um loiro muito claro, quase branco.",
  },
  {
    value: 15792383,
    label: "Loiro Platinado",
    description: "Um loiro extremamente claro com um tom frio quase prateado.",
  },
  {
    value: 10835753,
    label: "Ruivo",
    description:
      "Um vermelho profundo e rico, característico dos cabelos ruivos.",
  },
  {
    value: 9259587,
    label: "Acaju",
    description: "Um marrom avermelhado, uma tonalidade quente e profunda.",
  },
  {
    value: 9473676,
    label: "Cinza",
    description: "Representa cabelos grisalhos ou prateados.",
  },
  {
    value: 15658734,
    label: "Branco",
    description: "Cabelo totalmente desprovido de pigmento, branco puro.",
  },
];

// Componente customizado para opções
function CustomOption(props) {
  return (
    <components.Option
      {...props}
      className="d-flex justify-content-between align-items-start text-start"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">{props.data.label}</div>
        {props.data.description}
      </div>
      <span className="badge">
        <IconContext.Provider
          value={{ color: props.value.toString(16).padStart(6, "0") }}
        >
          <FaCircle />
        </IconContext.Provider>
      </span>
    </components.Option>
  );
}

function Select_hair(props) {
  return (
    <>
      <Select
        {...props}
        options={options}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "var(--bs-border-radius-xxl)!important",
            margin: ".5rem!important",
            border:
              "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
            boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
            width: "100%",
          }),
        }}
        components={{ Option: CustomOption }}
      />
    </>
  );
}

export default Select_hair;
