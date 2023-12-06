<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { applicationState, localConfigure } from "../store";
    import clone from "just-clone";
    import type { LocalConfigure } from "../types";
    import { updateTheme } from "../utils/theme";
    import {
        downloadString,
        fetchWithCROSProxy,
        generateUUID,
        isValidHttpUrl,
    } from "../utils/misc";
    import { createCheckers, func } from "ts-interface-checker";
    import exportedTypeSuite from "../types-ti";
    import { CONFIGURE } from "../configure";

    let originalConfigure: LocalConfigure = clone($localConfigure);

    onMount(() => {
        console.debug("Enter Configure Page.");
    });

    let remoteResourceURL: string = isValidHttpUrl(originalConfigure.data.data)
        ? originalConfigure.data.data
        : "https://...";

    async function checkRemoteResources() {
        try {
            const request = await fetchWithCROSProxy(remoteResourceURL);
            const data = await request.json();

            if (data.status.http_code != 200) {
                throw Error(data.status.http_code.toString());
            }

            // verify if json data is valid
            console.debug("Checking data ", data.contents);
            const { PageConfigure } = createCheckers(exportedTypeSuite);
            const result = PageConfigure.strictCheck(data.contents);
            console.debug("Check result : ", result);

            // now modify configure
            originalConfigure.data.data = remoteResourceURL;
            originalConfigure.data.type = "Remote";
            localConfigure.update(originalConfigure);
            alert("加载完毕！");
        } catch (e) {
            alert("远程内容无效！" + (e as any).toString());
            // data will not modify
        }
    }

    function handleProcessLocalConfigure() {
        let fileContent = "";

        console.debug("Upload local file.");
        const fp = document.createElement("input");
        fp.setAttribute("type", "file");
        fp.onchange = (e) => {
            const reader = new FileReader();
            reader.onload = function () {
                fileContent = reader.result?.toString() || "";

                // check file content
                if (fileContent !== "") {
                    try {
                        const { PageConfigure } =
                            createCheckers(exportedTypeSuite);
                        PageConfigure.strictCheck(JSON.parse(fileContent));

                        // now load into configure
                        originalConfigure.data.type = "Local";
                        originalConfigure.data.data =
                            JSON.stringify(fileContent);
                        localConfigure.update(originalConfigure);
                        alert("加载完成！刷新页面查看效果。");
                    } catch (e) {
                        alert("文件内容不合法：" + (e as any).toString());
                        console.debug(e);
                        return;
                    }
                } else {
                    alert("无文件内容");
                    return;
                }
            };
            if (fp.files != null) reader.readAsText(fp.files[0]);
        };
        fp.click();
    }

    let userInputGradientString: string = originalConfigure.theme.bgGradient;
    let userInputPictureString: string = originalConfigure.theme.bgPicture;

    function checkAndApplyPicture(e: any) {
        userInputPictureString = userInputPictureString.trim();
        if (!isValidHttpUrl(userInputPictureString)) {
            alert("不是一个有效的网址！");
            return;
        }
        originalConfigure.theme.bgType = "picture";
        originalConfigure.theme.bgPicture = userInputPictureString;
        localConfigure.update(originalConfigure);
        updateTheme(originalConfigure);
    }

    function checkAndApplyGradient(e: any) {
        userInputGradientString = userInputGradientString.trim();
        if (userInputGradientString.startsWith("background-image")) {
            userInputGradientString = userInputGradientString
                .substring(17)
                .trim();
        }
        if (!userInputGradientString.startsWith("linear")) {
            alert(
                "无效！应该是以 liner-gradient 或者 background-image 开头的 CSS 属性！",
            );
            return;
        }
        originalConfigure.theme.bgGradient = userInputGradientString;
        originalConfigure.theme.bgType = "gradient";
        localConfigure.update(originalConfigure);
        updateTheme(originalConfigure);
    }

    function handleChangeTheme(e: any) {
        originalConfigure.theme.bgType = e.currentTarget.value;
        localConfigure.update(originalConfigure);
        updateTheme(originalConfigure);
    }
</script>

<div in:fade={{ delay: 250, duration: 100 }}>
    <header>
        <h2>设置</h2>
    </header>

    <article>
        <fieldset>
            <span>背景与主题</span>
            <select
                on:change={handleChangeTheme}
                bind:value={originalConfigure.theme.bgType}
            >
                <option value="none">默认背景</option>
                <option value="picture">网络图片</option>
                <option value="gradient">渐变背景</option>
            </select>
        </fieldset>

        {#if originalConfigure.theme.bgType == "gradient"}
            <fieldset>
                <span>渐变色设置</span>
                <div class="data-actions">
                    <input bind:value={userInputGradientString} />

                    <button on:click={checkAndApplyGradient}>应用</button
                    ><button
                        on:click={(e) =>
                            window.open(
                                "https://www.joshwcomeau.com/gradient-generator/",
                            )}>编辑</button
                    >
                </div>
            </fieldset>
        {:else if originalConfigure.theme.bgType == "picture"}
            <fieldset>
                <span>图片设置</span>
                <div class="data-actions">
                    <input bind:value={userInputPictureString} />
                    <button on:click={checkAndApplyPicture}>应用</button>
                </div>
            </fieldset>
        {/if}

        <hr />
        <fieldset>
            <span>内容来源</span>
            <select bind:value={originalConfigure.data.type}>
                <option value="Local">从本地</option>
                <option value="Remote">从网络</option>
            </select>
        </fieldset>

        {#if originalConfigure.data.type === "Remote"}
            <fieldset>
                <span>远程配置文件地址</span>
                <div class="data-actions">
                    <input disabled placeholder="暂不支持" />
                    <!-- <input bind:value={remoteResourceURL} /> -->
                    <button on:click={() => checkRemoteResources()}>加载</button
                    >
                </div>
            </fieldset>
        {:else}
            <fieldset>
                <span>本地配置文件</span>
                <div class="data-actions">
                    <button
                        on:click|preventDefault={handleProcessLocalConfigure}
                        >导入文件</button
                    >
                </div>
            </fieldset>
        {/if}

        <hr />
        <fieldset>
            <span>更多内容操作</span>
            <div>
                <button
                    on:click={(e) => {
                        downloadString(
                            JSON.stringify($applicationState.pageConfigure),
                        );
                    }}>导出本地内容</button
                >
                <button on:click={(e) => window.open(CONFIGURE.COMMUNITY_URL)}
                    >浏览内容广场</button
                >
            </div>
        </fieldset>
        <fieldset>
            <span>更多</span>
            <div>
                <button on:click={(e) => window.open(CONFIGURE.GITHUB_REPO)}
                    >前往 Github 仓库</button
                >
                <button
                    on:click={(e) => {
                        const confirmWords = generateUUID().substring(0, 5);
                        if (
                            prompt("输入验证码 " + confirmWords) ===
                            confirmWords
                        ) {
                            localStorage.clear();
                            sessionStorage.clear();
                            location.reload();
                        } else {
                            alert("验证码不匹配。");
                        }
                    }}><strong>清除数据</strong></button
                >
            </div>
        </fieldset>
        <hr />
    </article>
</div>

<style>
    button {
        cursor: pointer;
        border: none;
        padding: 10px;
        margin: 5px;
    }
    .data-actions {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    input {
        padding: 5px;
        background: transparent;
        border: none;
        font-family: "Courier New", Courier, monospace;
        color: white;
        border-bottom: 2px solid white;
    }
    select {
        padding: 8px;
        border-radius: 0px;
        border: 0;
    }
    fieldset {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: none;
        color: white;
    }
    fieldset > span {
        font-size: 20px;
    }
    select {
        display: inline;
    }

    header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 35px;
        position: relative;
        height: 70px;
        font-size: 20px;
    }

    article {
        margin-left: 50px;
        margin-right: 50px;
    }
</style>
