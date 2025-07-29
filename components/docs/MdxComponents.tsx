export const MdxComponents = {
  h1: (props: any) => <h1 style={{ fontSize: "2em", fontWeight: "bold", margin: "1em 0" }} {...props} />,
  h2: (props: any) => <h2 style={{ fontSize: "1.5em", fontWeight: "bold", margin: "0.8em 0" }} {...props} />,
  h3: (props: any) => <h3 style={{ fontSize: "1.2em", fontWeight: "bold", margin: "0.6em 0" }} {...props} />,
  p: (props: any) => <p style={{ margin: "0.5em 0", lineHeight: "1.6" }} {...props} />,
  a: (props: any) => (
    <a style={{ color: "#FF69B4", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: (props: any) => <ul style={{ margin: "0.5em 0", paddingLeft: "2em" }} {...props} />,
  li: (props: any) => <li style={{ margin: "0.2em 0" }} {...props} />,
}
