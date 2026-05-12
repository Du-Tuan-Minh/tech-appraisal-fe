import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private startPromise: Promise<void> | null = null;
    private joinedIssues = new Set<string>();

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

        this.connection.onreconnected(async () => {
            for (const issueId of this.joinedIssues) {
                try {
                    await this.connection?.invoke("JoinIssueGroup", issueId);
                } catch (err) {
                    console.error(`Rejoin failed for issue ${issueId}`, err);
                }
            }
        });

        this.startPromise = this.connection.start()
            .then(() => {
                console.log("SignalR Connected.");
                this.startPromise = null;
            })
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
        this.joinedIssues.add(issueId);
    }

    public async leaveIssueGroup(issueId: string) {
        await this.ensureConnected();
        await this.connection?.invoke("LeaveIssueGroup", issueId);
        this.joinedIssues.delete(issueId);
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
            this.joinedIssues.clear();
        }
    }

    public onReceiveNotification(callback: (notification: any) => void) {
        this.connection?.on("ReceiveNotification", callback);
    }

    public offReceiveNotification() {
        this.connection?.off("ReceiveNotification");
    }

    public onNotificationRead(callback: (notificationId: string) => void) {
        this.connection?.on("NotificationRead", callback);
    }

    public offNotificationRead() {
        this.connection?.off("NotificationRead");
    }

    public onNotificationDeleted(callback: (notificationId: string) => void) {
        this.connection?.on("NotificationDeleted", callback);
    }

    public offNotificationDeleted() {
        this.connection?.off("NotificationDeleted");
    }
}

export const signalRService = new SignalRService();