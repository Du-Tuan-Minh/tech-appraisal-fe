import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private startPromise: Promise<void> | null = null;

    public async startConnection() {
        // Tránh khởi tạo nhiều lần nếu đang trong quá trình kết nối
        if (this.startPromise) return this.startPromise;

        const url = import.meta.env.VITE_SIGNALR_URL;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => localStorage.getItem("accessToken") || ""
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.startPromise = this.connection.start()
            .then(() => console.log("SignalR Connected."))
            .catch(err => {
                this.startPromise = null;
                console.error("SignalR Error: ", err);
                throw err;
            });

        return this.startPromise;
    }

    public async joinIssueGroup(issueId: string) {
        await this.ensureConnected();
        await this.connection?.invoke("JoinIssueGroup", issueId);
    }

    public async leaveIssueGroup(issueId: string) {
        await this.ensureConnected();
        await this.connection?.invoke("LeaveIssueGroup", issueId);
    }

    // Cơ chế đảm bảo kết nối trước khi gọi lệnh
    private async ensureConnected() {
        if (!this.connection) await this.startConnection();
        if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
            await this.startConnection();
        }
        await this.startPromise;
    }

    public onReceiveComment(callback: (comment: any) => void) {
        this.connection?.on("ReceiveComment", callback);
    }

    public offReceiveComment() {
        this.connection?.off("ReceiveComment");
    }

    public async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            this.startPromise = null;
        }
    }
}

export const signalRService = new SignalRService();