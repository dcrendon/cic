import { Toast } from "@base-ui/react/toast"

const manager = Toast.createToastManager()

export const toast = {
  ...manager,
  success: (title: string) => manager.add({ title, type: "success" }),
  error: (title: string) => manager.add({ title, type: "error" }),
}
