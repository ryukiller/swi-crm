import { Button, Titoli, Totale, Paragrafo, Elenco } from "../elements";

const PreviewRenderer = ({ item }) => {

    console.log(item)

    const renderComponent = () => {
        switch (item.type) {
            case "title":
                return (
                    <Titoli
                        content={item.content}
                    />
                );
            case "paragrafo":
                return (
                    <Paragrafo
                        content={item.content}
                    />
                );
            case "elenco":
                return (
                    <Elenco
                        content={item.content}
                    />
                );
            case "totale":
                return <Totale content={item.content} />;
            default:
                return null;
        }
    };

    return (
        <div>{renderComponent()}</div>
    );
};

export default PreviewRenderer;