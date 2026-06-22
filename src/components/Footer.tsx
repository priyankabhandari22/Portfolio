export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Priyanka Bhandari. Built with
          passion.
        </p>
        <p className="text-gray-600 text-sm">
          Crafted with{" "}
           <span className="text-cyan-400">Framer Motion</span>,{" "}
           <span className="text-cyan-400">GSAP</span> &{" "}
          <span className="text-amber-400">Next.js</span>
        </p>
      </div>
    </footer>
  );
}
