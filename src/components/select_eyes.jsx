import Select, { components } from "react-select";
import { IconContext } from "react-icons";
import { FaCircle } from "react-icons/fa";
//import dynamic from "next/dynamic";

const options = [
  {
    value: 5125166,
    label: "Castanho Escuro",
    description: "É cor rica em melanina, variando de médio a quase preto.",
  },
  {
    value: 9262372,
    label: "Castanho Claro",
    description:
      "Menos melanina que o castanho escuro, com tons de âmbar a médio, podendo ter nuances douradas.",
  },
  {
    value: 2773694,
    label: "Azul",
    description:
      "Baixa concentração de melanina com dispersão da luz, refletindo tons de azul, de claro a intenso.",
  },
  {
    value: 7263183,
    label: "Azul Claro",
    description:
      "Variação pálida do azul, quase translúcida, sensível à luz, lembra céu claro ou gelo.",
  },
  {
    value: 776785,
    label: "Verde",
    description:
      "Raros, com moderada melanina e alto lipocromo, variam de esmeralda a verde opaco.",
  },
  {
    value: 11123357,
    label: "Verde Claro",
    description:
      "Tons suaves de verde, misturados com dourado ou castanho, mudam conforme a iluminação.",
  },
  {
    value: 16760576,
    label: "Âmbar",
    description:
      "Distintos, com cor dourada ou cobre devido ao lipocromo, de dourado claro a castanho avermelhado.",
  },
  {
    value: 12500670,
    label: "Cinza",
    description:
      "Baixa melanina, tom cinza que pode parecer azul ou verde dependendo da luz.",
  },
  {
    value: 9468243,
    label: "Avelã",
    description:
      "Mistura de verde e castanho, com manchas ou raios, anel exterior frequentemente mais escuro.",
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

function Select_eyes(props) {
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

export default Select_eyes;
