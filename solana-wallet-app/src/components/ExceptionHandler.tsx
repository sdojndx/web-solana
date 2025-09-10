import React from 'react';

interface ExceptionHandlerProps {
  error: Error | null;
}

const ExceptionHandler: React.FC<ExceptionHandlerProps> = ({ error }) => {
  const getErrorMessage = (error: Error) => {
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient balance. Please fund your wallet.';
    } else if (error.message.includes('User rejected the request')) {
      return 'Transaction was cancelled by the user.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="exception-handler">
      {error && (
        <div className="error-message">
          {getErrorMessage(error)}
        </div>
      )}
    </div>
  );
};

export default ExceptionHandler;