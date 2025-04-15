import style from "./Empty.module.css";
import classNames from "classnames/bind";
import InboxIcon from '@mui/icons-material/Inbox';

const cn = classNames.bind(style)
export default function Empty({ message }) {
    return (
        <>
            <div className={cn("notification-non-review")}>
                <InboxIcon />
                <span>{message}</span>
            </div>
        </>
    )
}