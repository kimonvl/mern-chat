
const SearchedUser = ({user, socket}) => {

    const addUser = () => {
        socket.send(JSON.stringify({type: 'add-friend', data: user}));
    }

    return (
        <div key={user.userId}>
            <span>{user.username}</span>
            <button onClick={addUser} className="bg-red-500">ADD</button>
        </div>
    );
}

export default SearchedUser;