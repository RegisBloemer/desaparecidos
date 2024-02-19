import Fuse from "fuse.js";
import AsyncSelect from "react-select/async";
import { FixedSizeList as List } from "react-window";

const OPTION_HEIGHT = 40;
const ROWS = 6;

const MenuList = ({ options, children, getValue, width }) => {
  const [value] = getValue();
  const initialOffset =
    options.indexOf(value) !== -1
      ? Array.isArray(children) && children.length >= ROWS
        ? options.indexOf(value) >= ROWS
          ? options.indexOf(value) * OPTION_HEIGHT - OPTION_HEIGHT * 5
          : 0
        : 0
      : 0;

  return Array.isArray(children) ? (
    <List
      height={
        children.length >= ROWS
          ? OPTION_HEIGHT * ROWS
          : children.length * OPTION_HEIGHT
      }
      width={width}
      itemCount={children.length}
      itemSize={OPTION_HEIGHT}
      initialScrollOffset={initialOffset}
    >
      {({ style, index }) => {
        return (
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              ...style,
            }}
          >
            {children[index]}
          </div>
        );
      }}
    </List>
  ) : (
    <div>{children}</div>
  );
};

export default function Select_large(props) {
  const myIndex = Fuse.createIndex(["label"], props.options);

  const fuse = new Fuse(
    props.options,
    {
      keys: ["label"],
      threshold: 0.3,
    },
    myIndex
  );

  return (
    <AsyncSelect
      {...props}
      filterOption={false}
      components={{ MenuList }}
      defaultOptions={props.options}
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
      loadOptions={(value) => {
        return new Promise((resolve) => {
          const filter = fuse.search(value);
          if (!value.length) {
            resolve(props.options);
          } else {
            if (filter.length == 0) {
              resolve([]);
            } else {
              const result = filter.map((e) => {
                return { ...e.item };
              });
              resolve(result);
            }
          }
        });
      }}
    />
  );
}
