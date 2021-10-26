import React from "react"
import Link from 'next/link'


const Home = () => {
    return (
        <div>
            <div className="container">
                <div>
                    <p>Home</p>
                </div>
           </div>
            <style jsx>{`
                .container {
                    @apply m-20 flex flex-row flex-wrap justify-center items-center;
                }
            `}</style>
        </div>
    )
}

export default Home