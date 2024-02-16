import Select, { components } from "react-select";
import { IconContext } from "react-icons";
import { FaRegEye } from "react-icons/fa";
//import dynamic from "next/dynamic";

const options = [
  { value: 5125166, label: "Castanho Escuro" },
  { value: 9262372, label: "Castanho Claro" },
  { value: 2773694, label: "Azul" },
  { value: 7263183, label: "Azul Claro" },
  { value: 776785, label: "Verde" },
  { value: 11123357, label: "Verde Claro" },
  { value: 16760576, label: "Âmbar" },
  { value: 12500670, label: "Cinza" },
  { value: 9468243, label: "Avelã" },
];

// Componente customizado para opções
function CustomOption(props) {
  return (
    <components.Option {...props}>
      {props.data.label}{" "}
      <IconContext.Provider
        value={{ color: props.value.toString(16).padStart(6, "0") }}
      >
        <FaRegEye />
      </IconContext.Provider>
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
