```mermaid
sequenceDiagram
    participant A as サーバ
    participant B as クライアント


    B-)A: LEDの状態を問い合わせる
    A-)A: フラグが1だったらLEDを反転
    A-)B: LEDの状態
    B-)B: 間隔を空けて繰り返す

```
