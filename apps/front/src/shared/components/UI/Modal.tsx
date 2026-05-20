import type { ReactNode, RefObject } from "react";

interface IModal {
    ref: RefObject<HTMLDialogElement | null>,
    title: string,
    children: ReactNode
}
export default function Modal({ref, title, children}: IModal) {


  return (
    <>
        <dialog ref={ref} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                {children}
                <div className="modal-action">
                    <button className="btn mr-2" onClick={() => ref.current?.close()}>Java button</button>
                    <form method="dialog">
                        <button className="btn">cancel button</button>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </>
  )
}