import type { IAlertMessage } from "../interfaces/IAlertMessage";

const AlertMessage = ({ message }: { message: IAlertMessage }) => {
  return (
    <div
      className={`mb-4 flex flex-col items-center rounded-lg p-4 text-sm animate-fade-in${
        message.type === "success"
          ? "text-green-800 dark:text-green-400"
          : message.type === "warning"
            ? " text-yellow-800 dark:text-yellow-300"
            : " text-red-800 dark:text-red-400"
      }`}
      role="alert"
    >
      <span className="font-semibold">{message.title}</span>
      {message.description}
    </div>
  );
};

export default AlertMessage;
