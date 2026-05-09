export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-xl ${props.className || 'w-10 h-10'}`}>
            <span className="font-serif text-xl font-bold text-white">S</span>
        </div>
    );
}
