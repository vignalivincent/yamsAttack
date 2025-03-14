import { FC } from 'react';

interface ModalHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

export const ModalHeader: FC<ModalHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-bold text-purple-900">{title}</h3>
      <p className="text-purple-600">{description}</p>
    </div>
  );
}; 