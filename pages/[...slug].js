import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from "../components/Header"
import CategoryList from "../components/CategoryList"

import axios from "axios"

const renderContent = (slug, pageType, categories) => {
    switch(pageType) {
        case "categoriesHome":
            return <CategoryList categories={categories} />
        default:
            return <p>Slug : {slug}</p>
    }
}

const Slug = (props) => {
    const Router = useRouter()
    const { slug } = Router.query
    console.log("props : ", props)
    console.log("slug : ", slug)
    
    return (
        <>
            <Header theme={props.theme} />
            {renderContent(slug, props.pageType, props.categories)}
        </>
    )
}

const getThemes = async () => {
    const query = `{
        themes {
            style,
            logo
        }
    }`
    const res = await axios.post("http://localhost:1337/graphql", { query })
    return res.data.data.themes
}

const getCategories = async () => {
    const query = `{
        categories {
            name,
            description,
            image {
                url
            },
            products {
                name,
                description,
                image {
                    url
                }
            }
        }
    }`
    const res = await axios.post("http://localhost:1337/graphql", { query })
    return res.data.data.categories
}

export const getStaticPaths = async () => {
    
    // console.log("res : ", JSON.stringify(res.data, null, 2))
    // const slugs = [["categories"], ["c1"], ["c1", "p11"], ["c2"], ["c2", "P21"], ["c2", "P22"]]
    const categories = await getCategories()
    console.log("categories : ", categories)
    const slugs = [["categories"]]
    categories.forEach(c => {
        slugs.push([c.name])
        c.products.forEach(p => {
            slugs.push([c.name, p.name])
        })
    })
    const paths = slugs.map(slug => ({
        params: {
            slug
        }
    }))
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async (context) => {
    const { slug } = context.params
    console.log("slug : ", slug)
    const categories = await getCategories()
    const themes = await getThemes()
    console.log("categories : ", categories)
    let pageType = slug.length === 1 ? (slug[0] === "categories" ? "categoriesHome" : "category") : "product"
    return {
        props : {
            pageType,
            categories,
            theme: themes[0]
        }
    }
}

export default Slug;