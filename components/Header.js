import React from "react"
import Link from 'next/link'

// const style = {
//     'header-background-color': '#f1f1f1',
// };

const Header = ({ theme={} }) => {
    const { logo, style={} } = theme
    return (
        <>
            <style jsx>{`
                .header {
                    --header-background-color: ${(style && style.header && style.header['header-background-color'] || 'lightsteelblue')};
                    @apply flex flex-row justify-between items-center w-full h-10 p-4 bg-header-background-color text-white;
                }
            `}</style>
            <div>
                <div
                    className="header"
                >
                    <Link href="/"><a>{logo || "DefaultCompany"}</a></Link>
                    <p>User</p>
                </div>
            </div>
        </>
    );
};

export default Header;
