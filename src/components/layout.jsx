import Nominatim from "@/components/nominatim";
import Header from "@/components/header";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <Nominatim />
            <>{children}</>
        </>
    );
};
export default Layout;