export interface ModalProps {
  show: boolean;
  onDismiss?: Handler;
}


export type Handler = () => void;
