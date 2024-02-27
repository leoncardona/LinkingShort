import type { IAlertMessage } from '../interfaces/IAlertMessage';

const AlertMessage = ({ message }: { message: IAlertMessage }) => {
  return (
    <div
    className={`mb-4 flex flex-col items-center rounded-lg p-4 text-sm ${
      message.type === "success"
        ? "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400"
        : message.type === "warning"
          ? "bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
          : "bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400"
    }`}
    role="alert"
  >
    <span className="font-semibold">{message.title}</span>
    {message.description}
  </div>
  )
}

export default AlertMessage;
