import { useEffect, useMemo, useRef, useState } from "react";
import {
  AtSign,
  Bell,
  ChevronDown,
  ChevronRight,
  Circle,
  Compass,
  Crown,
  Download,
  Gift,
  Hash,
  Headphones,
  HelpCircle,
  ImagePlus,
  Inbox,
  Menu,
  MessageCircle,
  MessagesSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  Pin,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Sparkles,
  Sticker,
  UserPlus,
  Users,
  Video,
  Volume2,
  X,
} from "lucide-react";

const starterGuilds = [
  {
    id: "modi-lounge",
    name: "MODI 라운지",
    icon: "M",
    color: "violet",
    channels: [
      { id: "welcome", name: "환영합니다", kind: "text" },
      { id: "general", name: "자유 채팅", kind: "text" },
      { id: "share", name: "사진과 링크", kind: "text" },
      { id: "voice-lounge", name: "라운지", kind: "voice" },
      { id: "voice-game", name: "게임방", kind: "voice" },
    ],
  },
  {
    id: "dev-club",
    name: "개발자 모임",
    icon: "D",
    color: "blue",
    channels: [
      { id: "dev-chat", name: "개발 이야기", kind: "text" },
      { id: "frontend", name: "프론트엔드", kind: "text" },
      { id: "dev-voice", name: "코딩 같이하기", kind: "voice" },
    ],
  },
  {
    id: "game-night",
    name: "게임 친구들",
    icon: "G",
    color: "orange",
    channels: [
      { id: "game-chat", name: "게임 수다", kind: "text" },
      { id: "party", name: "파티 모집", kind: "text" },
      { id: "game-voice", name: "음성 파티", kind: "voice" },
    ],
  },
];

const starterMembers = [
  { id: "me", name: "하주영", tag: "나", color: "purple", status: "online", role: "내 계정" },
  { id: "min", name: "민서", tag: "관리자", color: "pink", status: "online", role: "관리자" },
  { id: "jun", name: "준호", tag: "", color: "blue", status: "online", role: "온라인" },
  { id: "seo", name: "서연", tag: "", color: "green", status: "idle", role: "자리 비움" },
  { id: "do", name: "도윤", tag: "", color: "orange", status: "offline", role: "오프라인" },
];

const starterMessages = {
  welcome: [
    { id: "w1", user: "min", text: "MODI에 온 걸 환영해요! 🎉", time: "오후 2:14" },
    { id: "w2", user: "jun", text: "여기서 편하게 이야기 나눠요.", time: "오후 2:16" },
    { id: "w3", user: "seo", text: "채널 목록에서 원하는 방을 골라보세요!", time: "오후 2:18" },
  ],
  general: [
    { id: "g1", user: "min", text: "오늘 다들 뭐 하고 있어요?", time: "오후 3:02" },
    { id: "g2", user: "jun", text: "새로운 프로젝트 구경하고 있어요 ㅎㅎ", time: "오후 3:04" },
    { id: "g3", user: "seo", text: "MODI 디자인 깔끔하네요!", time: "오후 3:06" },
  ],
  share: [
    { id: "s1", user: "do", text: "좋은 자료나 재미있는 링크를 공유하는 채널이에요.", time: "오후 1:30" },
  ],
  "dev-chat": [
    { id: "d1", user: "jun", text: "요즘 어떤 프레임워크 사용하세요?", time: "오후 12:40" },
  ],
  frontend: [
    { id: "f1", user: "seo", text: "컴포넌트 구조는 작게 나누는 편이 좋아요.", time: "오후 12:52" },
  ],
  "game-chat": [
    { id: "gm1", user: "do", text: "오늘 저녁에 같이 게임할 사람!", time: "오후 4:10" },
  ],
};

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function Avatar({ name, color = "purple", status, size = "normal" }) {
  const initials = name ? name.slice(0, 1) : "?";
  return (
    <span className={"avatar avatar-" + color + " avatar-" + size}>
      {initials}
      {status && <i className={"status-dot status-" + status} />}
    </span>
  );
}

function App() {
  const [guilds, setGuilds] = useState(() => readStorage("modi:guilds", starterGuilds));
  const [activeGuildId, setActiveGuildId] = useState("modi-lounge");
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [messagesByChannel, setMessagesByChannel] = useState(() =>
    readStorage("modi:messages", starterMessages)
  );
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [voiceConnected, setVoiceConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileChannelsOpen, setMobileChannelsOpen] = useState(false);
  const bottomRef = useRef(null);

  const activeGuild = guilds.find((guild) => guild.id === activeGuildId) || guilds[0];
  const activeChannel =
    activeGuild?.channels.find((channel) => channel.id === activeChannelId) ||
    activeGuild?.channels.find((channel) => channel.kind === "text") ||
    activeGuild?.channels[0];
  const members = starterMembers;
  const channelMessages = messagesByChannel[activeChannelId] || [];

  useEffect(() => {
    window.localStorage.setItem("modi:guilds", JSON.stringify(guilds));
  }, [guilds]);

  useEffect(() => {
    window.localStorage.setItem("modi:messages", JSON.stringify(messagesByChannel));
  }, [messagesByChannel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChannelId, channelMessages.length]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleMessages = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase();
    if (!query) return channelMessages;
    return channelMessages.filter((message) => message.text.toLocaleLowerCase().includes(query));
  }, [channelMessages, searchText]);

  function notify(text) {
    setToast(text);
  }

  function chooseGuild(guild) {
    setActiveGuildId(guild.id);
    const firstText = guild.channels.find((channel) => channel.kind === "text");
    setActiveChannelId(firstText ? firstText.id : guild.channels[0]?.id);
    setSearchText("");
    setMobileChannelsOpen(false);
  }

  function chooseChannel(channel) {
    setActiveChannelId(channel.id);
    setSearchText("");
    setMobileChannelsOpen(false);
    if (channel.kind === "voice") {
      setVoiceConnected(true);
      notify(channel.name + " 음성 채널에 연결했어요.");
    }
  }

  function createServer() {
    const name = window.prompt("새 서버 이름을 입력하세요.");
    if (!name || !name.trim()) return;
    const id = "server-" + Date.now();
    const newGuild = {
      id,
      name: name.trim(),
      icon: name.trim().slice(0, 1).toUpperCase(),
      color: "blue",
      channels: [
        { id: id + "-general", name: "일반", kind: "text" },
        { id: id + "-voice", name: "음성 채널", kind: "voice" },
      ],
    };
    setGuilds((current) => [...current, newGuild]);
    setActiveGuildId(id);
    setActiveChannelId(id + "-general");
    notify("새 서버를 만들었어요.");
  }

  function createChannel(kind) {
    const name = window.prompt(kind === "voice" ? "새 음성 채널 이름" : "새 텍스트 채널 이름");
    if (!name || !name.trim()) return;
    const id = activeGuild.id + "-" + Date.now();
    const channel = { id, name: name.trim().replace(/\s+/g, "-"), kind };
    setGuilds((current) =>
      current.map((guild) =>
        guild.id === activeGuild.id ? { ...guild, channels: [...guild.channels, channel] } : guild
      )
    );
    setActiveChannelId(id);
    notify("채널을 추가했어요.");
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || !activeChannel || activeChannel.kind !== "text") return;
    const now = new Date();
    const time = now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
    const message = { id: "msg-" + Date.now(), user: "me", text, time };
    setMessagesByChannel((current) => ({
      ...current,
      [activeChannelId]: [...(current[activeChannelId] || []), message],
    }));
    setMessageText("");
  }

  function handleComposerKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="app-shell">
      <aside className="server-rail" aria-label="서버 목록">
        <button className="home-button" title="홈" onClick={() => chooseGuild(guilds[0])}>
          <MessagesSquare size={23} strokeWidth={2.4} />
        </button>
        <div className="rail-divider" />
        {guilds.map((guild) => (
          <button
            key={guild.id}
            className={"server-button " + (activeGuild?.id === guild.id ? "server-active" : "")}
            title={guild.name}
            onClick={() => chooseGuild(guild)}
          >
            <span className={"server-icon server-" + guild.color}>{guild.icon}</span>
            <span className="server-tooltip">{guild.name}</span>
          </button>
        ))}
        <button className="server-add" title="서버 추가" onClick={createServer}>
          <Plus size={23} />
        </button>
        <button className="server-discover" title="서버 둘러보기" onClick={() => notify("서버 둘러보기는 다음 업데이트에서 추가할게요.")}>
          <Compass size={21} />
        </button>
        <div className="rail-spacer" />
        <button className="download-button" title="앱 다운로드" onClick={() => notify("MODI 웹 버전을 이용해 주셔서 감사합니다.")}>
          <Download size={20} />
        </button>
      </aside>

      <aside className={"channel-sidebar " + (mobileChannelsOpen ? "mobile-open" : "")}>
        <button className="guild-heading" onClick={() => notify(activeGuild.name + " 서버")}>
          <span>{activeGuild?.name || "MODI"}</span>
          <ChevronDown size={18} />
        </button>

        <div className="channel-scroll">
          <button className="sidebar-quick-link" onClick={() => notify("친구 기능은 계정 시스템 연동 후 사용할 수 있어요.")}>
            <Users size={19} />
            <span>친구</span>
          </button>
          <button className="sidebar-quick-link" onClick={() => notify("메시지 요청은 준비 중이에요.")}>
            <MessageCircle size={19} />
            <span>메시지 요청</span>
          </button>

          <div className="channel-category">
            <span>텍스트 채널</span>
            <button aria-label="텍스트 채널 추가" onClick={() => createChannel("text")}><Plus size={16} /></button>
          </div>
          {activeGuild?.channels.filter((channel) => channel.kind === "text").map((channel) => (
            <button
              key={channel.id}
              className={"channel-link " + (activeChannel?.id === channel.id ? "channel-active" : "")}
              onClick={() => chooseChannel(channel)}
            >
              <Hash size={18} />
              <span>{channel.name}</span>
              {activeChannel?.id === channel.id && <MoreHorizontal size={17} className="channel-more" />}
            </button>
          ))}

          <div className="channel-category voice-category">
            <span>음성 채널</span>
            <button aria-label="음성 채널 추가" onClick={() => createChannel("voice")}><Plus size={16} /></button>
          </div>
          {activeGuild?.channels.filter((channel) => channel.kind === "voice").map((channel) => (
            <button
              key={channel.id}
              className={"channel-link " + (activeChannel?.id === channel.id ? "channel-active" : "")}
              onClick={() => chooseChannel(channel)}
            >
              <Volume2 size={18} />
              <span>{channel.name}</span>
            </button>
          ))}

          <div className="sidebar-promo">
            <div className="promo-icon"><Sparkles size={18} /></div>
            <div>
              <strong>우리만의 공간</strong>
              <p>친구들을 초대해 대화를 시작해 보세요.</p>
            </div>
            <button onClick={() => notify("초대 링크 기능은 서버 백엔드 연결 후 추가할게요.")}>초대하기</button>
          </div>
        </div>

        {voiceConnected && (
          <div className="voice-status">
            <div className="voice-status-copy">
              <span className="voice-live-dot" />
              <div><strong>음성 연결됨</strong><small>{activeChannel?.kind === "voice" ? activeChannel.name : "음성 채널"}</small></div>
            </div>
            <button title="연결 해제" onClick={() => setVoiceConnected(false)}><X size={17} /></button>
          </div>
        )}

        <div className="user-panel">
          <Avatar name="하주영" color="purple" status="online" />
          <div className="user-details">
            <strong>하주영</strong>
            <span>온라인</span>
          </div>
          <button title="마이크 켜기/끄기" onClick={() => setMuted((value) => !value)}>
            {muted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button title="사용자 설정" onClick={() => notify("사용자 설정은 로그인 기능과 함께 추가할게요.")}>
            <Settings size={18} />
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="chat-header">
          <button className="mobile-menu" aria-label="채널 메뉴 열기" onClick={() => setMobileChannelsOpen((value) => !value)}>
            <Menu size={20} />
          </button>
          <div className="header-channel">
            {activeChannel?.kind === "voice" ? <Volume2 size={21} /> : <Hash size={21} />}
            <strong>{activeChannel?.name || "채널"}</strong>
            <span className="header-divider" />
            <p>{activeChannel?.kind === "voice" ? "음성으로 함께 이야기해요." : "이 채널에서 이야기를 나눠보세요."}</p>
          </div>
          <div className="header-actions">
            <button title="알림" onClick={() => notify("새로운 알림이 없어요.")}><Bell size={19} /></button>
            <button title="고정된 메시지" onClick={() => notify("고정된 메시지가 없어요.")}><Pin size={19} /></button>
            <button title="멤버 목록" className={showMembers ? "header-action-active" : ""} onClick={() => setShowMembers((value) => !value)}><Users size={19} /></button>
            <label className="search-box">
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="검색하기"
                aria-label="메시지 검색"
              />
              <Search size={16} />
            </label>
            <button title="받은 편지함" onClick={() => notify("받은 편지함은 준비 중이에요.")}><Inbox size={19} /></button>
            <button title="도움말" onClick={() => notify("MODI에 오신 것을 환영해요!") }><HelpCircle size={19} /></button>
          </div>
        </header>

        <div className="chat-body">
          <section className="conversation">
            {activeChannel?.kind === "voice" ? (
              <div className="voice-empty">
                <div className="voice-illustration"><Headphones size={42} /></div>
                <h2>{activeChannel.name}</h2>
                <p>음성 채널에 연결되어 있어요. 친구들을 초대해 함께 이야기해 보세요.</p>
                <button className="primary-button" onClick={() => setVoiceConnected((value) => !value)}>
                  {voiceConnected ? "연결 해제" : "음성 채널 참가"}
                </button>
              </div>
            ) : (
              <>
                <div className="welcome-block">
                  <div className="welcome-hash"><Hash size={31} /></div>
                  <h1>{activeChannel?.name} 채널에 오신 것을 환영해요!</h1>
                  <p>여기는 <strong>#{activeChannel?.name}</strong> 채널의 시작이에요.</p>
                  <button onClick={() => notify("채널 설정은 다음 업데이트에서 추가할게요.")}>채널 편집 <ChevronRight size={14} /></button>
                </div>

                <div className="message-list">
                  {visibleMessages.length === 0 ? (
                    <div className="empty-search">
                      {searchText ? "검색 결과가 없어요." : "아직 메시지가 없어요. 첫 메시지를 보내보세요!"}
                    </div>
                  ) : (
                    visibleMessages.map((message, index) => {
                      const user = members.find((member) => member.id === message.user) || members[0];
                      const previous = visibleMessages[index - 1];
                      const grouped = previous && previous.user === message.user && previous.time === message.time;
                      return (
                        <article className={"message-row " + (grouped ? "message-grouped" : "")} key={message.id}>
                          {!grouped && <Avatar name={user.name} color={user.color} />}
                          <div className="message-content">
                            {!grouped && (
                              <div className="message-meta">
                                <strong>{user.name}</strong>
                                {user.tag && <span className="member-tag">{user.tag}</span>}
                                <time>{message.time}</time>
                              </div>
                            )}
                            <p>{message.text}</p>
                          </div>
                          <div className="message-tools">
                            <button title="반응 추가" onClick={() => notify("메시지 반응 기능은 준비 중이에요.")}><Smile size={16} /></button>
                            <button title="더 보기" onClick={() => notify("메시지 메뉴는 준비 중이에요.")}><MoreHorizontal size={17} /></button>
                          </div>
                        </article>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <form className="composer" onSubmit={sendMessage}>
                  <button type="button" className="composer-add" title="첨부" onClick={() => notify("파일 첨부는 스토리지 연결 후 사용할 수 있어요.")}><Plus size={21} /></button>
                  <textarea
                    rows="1"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder={"#" + (activeChannel?.name || "채널") + "에 메시지 보내기"}
                    aria-label="메시지 입력"
                  />
                  <div className="composer-actions">
                    <button type="button" title="선물" onClick={() => notify("선물 기능은 준비 중이에요.")}><Gift size={19} /></button>
                    <button type="button" title="이미지" onClick={() => notify("이미지 첨부 기능은 준비 중이에요.")}><ImagePlus size={19} /></button>
                    <button type="button" title="스티커" onClick={() => notify("스티커 기능은 준비 중이에요.")}><Sticker size={19} /></button>
                    <button type="button" title="이모지" onClick={() => setMessageText((value) => value + " 😊")}><Smile size={19} /></button>
                    <button type="submit" className="send-button" title="메시지 보내기" disabled={!messageText.trim()}><Send size={18} /></button>
                  </div>
                </form>
              </>
            )}
          </section>

          {showMembers && (
            <aside className="member-sidebar">
              <div className="member-heading">멤버 — {members.length}</div>
              <div className="member-group-title">온라인 — {members.filter((member) => member.status !== "offline").length}</div>
              {members.filter((member) => member.status !== "offline").map((member) => (
                <button className="member-row" key={member.id} onClick={() => notify(member.name + "님의 프로필은 준비 중이에요.")}>
                  <Avatar name={member.name} color={member.color} status={member.status} />
                  <span className="member-info"><strong>{member.name}</strong><small>{member.role}</small></span>
                  {member.tag === "관리자" && <Crown size={14} className="member-crown" />}
                </button>
              ))}
              <div className="member-group-title offline-title">오프라인 — {members.filter((member) => member.status === "offline").length}</div>
              {members.filter((member) => member.status === "offline").map((member) => (
                <button className="member-row member-offline" key={member.id} onClick={() => notify(member.name + "님은 현재 오프라인이에요.")}>
                  <Avatar name={member.name} color={member.color} status={member.status} />
                  <span className="member-info"><strong>{member.name}</strong><small>{member.role}</small></span>
                </button>
              ))}
              <div className="member-footer">
                <ShieldCheck size={15} />
                <span>안전한 커뮤니티를 함께 만들어요.</span>
              </div>
            </aside>
          )}
        </div>
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default App;
