import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarUser from '../components/User/NavbarUser';
import cssModule from '../css/Product.module.css';
import convertRupiah from "rupiah-format";
import { Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query'

import { API } from '../config/api';

export default function Product() {
    const title = 'Shop';
    document.title = 'DumbMerch | ' + title;

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState(posts);
    console.log(category);
    const [searchTitle, setSearchTitle] = useState("");

    const filterItem = ((categItem) => {
        const updateditem = posts.filter((curElem) => {
            return curElem.categories[0].nameCategory === categItem;
        });
        setCategory(updateditem);
    });

    const allItem = () => {
        setCategory(posts)
    }
    // console.log(allItem);


    const config = {
        method: "GET",
        headers: {
            Authorization: "Basic " + localStorage.token,
        },
    };

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const response = await API.get('/products', config);
            setPosts(response.data.data);
            setTimeout(() => {
                setLoading(false)
            })
        }
        loadPosts();
    }, []);

    return (
        <>
            <NavbarUser title={title} />
            <div className="container text-center">
                <input type="text"
                    placeholder='Search Product'
                    onChange={(e) => setSearchTitle(e.target.value)} />
                <h3 className='mt-3'>DumbMerch</h3>
                <div>
                    <button className='btn btn-warning' onClick={() => filterItem('Laptop')}>laptop</button>
                    <button className='btn btn-warning' onClick={() => filterItem('Handphone')}>Mouse</button>
                    <button className='btn btn-warning' onClick={() => setCategory(posts)}>All</button>
                </div>
            </div>
            {loading ? <div className='container'>waiting</div> : <></>}
            <div className="container d-flex flex-wrap mt-3">
                {category?.length === 0 ? (<>
                    {posts.map((item, index) => (
                        <div>
                            <div item={item} key={index}></div>
                            <div className={cssModule.product1}>
                                <img src={item.image} width={'100%'} height={'200px'} className='img-fluid mb-2' alt={item.name} />
                                <div>
                                    <Link to={`/ detail / ${item.id}`}><p className='ps-2'><span>{item.name}</span ></p></Link>
                                    <p className='ps-2'>{convertRupiah.convert(item.price)}</p>
                                    <p className='ps-2'>Stok: {item.qty}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                ) : (
                    posts && category
                        .filter((value) => {
                            if (searchTitle === '') {
                                return value;
                            } else if (value.name.toLowerCase().includes(searchTitle.toLowerCase())
                            ) {
                                return value;
                            }
                        })
                        .map((item, index) => {
                            return (
                                <div>
                                    <div item={item} key={index}></div>
                                    <div className={cssModule.product1}>
                                        <img src={item.image} width={'100%'} height={'200px'} className='img-fluid mb-2' alt={item.name} />
                                        <div>
                                            <Link to={`/ detail / ${item.id}`}><p className='ps-2'><span>{item.name}</span ></p></Link>
                                            <p className='ps-2'>{convertRupiah.convert(item.price)}</p>
                                            <p className='ps-2'>Stok: {item.qty}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                )}
            </div >

        </>
    )
}

