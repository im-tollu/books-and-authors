interface Props {
    lastAddedBook: string
}

export const LastAddedBookComponent: React.FC<Props> = ({ lastAddedBook }) => {
    return (
        <div>
            <span>Last Added Book:</span> <span>{lastAddedBook}</span>
        </div>
    )
}