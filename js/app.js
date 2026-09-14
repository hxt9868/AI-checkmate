(function () {
  "use strict";

  var STORAGE_KEY = "pickup-checklist-practice-v2";

  var groups = [
    {
      listId: "list-exterior",
      items: [
        { id: "paint", text: "车漆", hint: "检查漆面有无明显瑕疵" },
        { id: "hub", text: "轮毂", hint: "检查轮毂外观是否完好" },
        { id: "tire", text: "轮胎", hint: "检查轮胎外观是否正常" },
        { id: "glass", text: "玻璃", hint: "检查玻璃有无破损" },
      ],
    },
    {
      listId: "list-interior",
      items: [
        { id: "seat", text: "座椅皮面", hint: "检查座椅有无破损、污渍" },
        { id: "screen", text: "屏幕", hint: "检查有无划痕" },
        { id: "console", text: "中控台饰板", hint: "检查饰板外观是否完好" },
        { id: "audio", text: "音响", hint: "确认音响工作正常（可在屏幕上打开在云听广播测试）" },
        { id: "ac", text: "空调", hint: "确认空调出风正常" },
      ],
    },
    {
      listId: "list-docs",
      items: [
        {
          id: "docs-pack",
          text: "合格证、一致性证书、环保清单、拓印号",
          hint: "随车文件都在资料袋中，发票和保单都为电子版，无纸质文档",
        },
      ],
    },
  ];

  var checked = load();
  var progressText = document.getElementById("progressText");
  var progressFill = document.getElementById("progressFill");

  function allItemIds() {
    var ids = [];
    groups.forEach(function (group) {
      group.items.forEach(function (item) {
        ids.push(item.id);
      });
    });
    return ids;
  }

  function getTotal() {
    return allItemIds().length;
  }

  function getDone() {
    var ids = allItemIds();
    var count = 0;
    ids.forEach(function (id) {
      if (checked.has(id)) count += 1;
    });
    return count;
  }

  function updateProgress() {
    var total = getTotal();
    var done = getDone();
    var percent = total > 0 ? Math.round((done / total) * 100) : 0;

    if (progressText) {
      progressText.textContent = "已完成 " + done + "/" + total + " 项";
    }
    if (progressFill) {
      progressFill.style.width = percent + "%";
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) {}
    return new Set();
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checked)));
    } catch (e) {}
  }

  function renderGroup(group) {
    var list = document.getElementById(group.listId);
    if (!list) return;
    list.innerHTML = "";

    group.items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "item";

      var label = document.createElement("label");
      label.className = "label";
      label.setAttribute("for", item.id);

      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "input";
      input.id = item.id;
      input.checked = checked.has(item.id);

      input.addEventListener("change", function () {
        if (input.checked) {
          checked.add(item.id);
        } else {
          checked.delete(item.id);
        }
        save();
        updateProgress();
      });

      var box = document.createElement("span");
      box.className = "box";
      box.setAttribute("aria-hidden", "true");

      var text = document.createElement("span");
      text.className = "text";
      text.appendChild(document.createTextNode(item.text));

      if (item.hint) {
        var hint = document.createElement("span");
        hint.className = "hint";
        hint.textContent = item.hint;
        text.appendChild(hint);
      }

      label.appendChild(input);
      label.appendChild(box);
      label.appendChild(text);
      li.appendChild(label);
      list.appendChild(li);
    });
  }

  groups.forEach(renderGroup);
  updateProgress();
})();
