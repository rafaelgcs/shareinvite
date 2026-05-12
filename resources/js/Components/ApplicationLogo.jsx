export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center justify-center font-serif ${props.className || 'w-10 h-10'}`}>
            <span className="text-xl font-black tracking-tighter">M<span className="opacity-50">i</span></span>
        </div>
    );
}
