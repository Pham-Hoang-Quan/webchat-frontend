import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";


const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }


        const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));


        if (conversation) {
            setSelectedConversation(conversation);
            setSearch("");
        } else toast.error("No such user found!");
    };
    return (
        <form onSubmit={handleSubmit} className='relative'>
            <input
                style={{ background: '#F7F8FC', paddingRight: '2.5rem' }}
                type='text'
                placeholder='Search…'
                className='input input-bordered rounded-full w-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className='text-white absolute right-0 top-1/2 transform -translate-y-1/2' style={{ background: 'transparent'}}>
                <IoSearchSharp className='w-6 h-6 outline-none' style={{ color: '#0462C4', marginRight: 15 }} />
            </button>
        </form>
    );
};
export default SearchInput;


// STARTER CODE SNIPPET
// import { IoSearchSharp } from "react-icons/io5";


// const SearchInput = () => {
//  return (
//      <form className='flex items-center gap-2'>
//          <input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
//          <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
//              <IoSearchSharp className='w-6 h-6 outline-none' />
//          </button>
//      </form>
//  );
// };
// export default SearchInput;





