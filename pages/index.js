import React from "react"
import Link from 'next/link'


const Home = () => {
    return (
        <div>
            <div className="container">
                <div className="card">
                <   Link href="/[...slug]" as="/categories">
                        <a>Categories</a>
                    </Link>
                </div>
           </div>
            <style jsx>{`
                .container {
                    @apply m-20 flex flex-row flex-wrap justify-center items-center;
                }
                .card {
                    @apply w-96 h-96 border-2 border-solid border-gray-200 
                            rounded-lg shadow-sm flex flex-row justify-center items-center;
                }
            `}</style>
        </div>
    )
}

export default Home