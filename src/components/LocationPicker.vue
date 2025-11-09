<template>
  <div class="location-picker-backdrop" role="dialog" aria-modal="true">
    <div class="location-picker">
      <header class="location-picker__header">
        <h2>{{ title }}</h2>
        <button type="button" class="location-picker__close" @click="$emit('cancel')">×</button>
      </header>
      <div class="location-picker__search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="주소를 입력해 주세요"
          @keydown.enter.prevent="searchAddress"
        />
        <button type="button" :disabled="searching" @click="searchAddress">
          {{ searching ? '검색 중...' : '주소 검색' }}
        </button>
      </div>
      <p v-if="searchStatus" class="location-picker__status">{{ searchStatus }}</p>
      <div ref="mapEl" class="location-picker__map" />
      <p class="location-picker__coords">위도 {{ selectedPosition.lat.toFixed(5) }}, 경도 {{ selectedPosition.lng.toFixed(5) }}</p>
      <div class="location-picker__actions">
        <button type="button" class="picker-btn picker-btn--ghost" @click="$emit('cancel')">취소</button>
        <button type="button" class="picker-btn picker-btn--primary" @click="confirmSelection">위치 선택</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { GeoPoint } from '@/types/rooms'
import { loadKakaoMaps } from '@/utils/kakaoMaps'

type KakaoNamespace = typeof window.kakao

const props = defineProps<{
  title: string
  initialPosition?: GeoPoint
}>()

const emit = defineEmits<{
  confirm: [GeoPoint]
  cancel: []
}>()

const mapEl = ref<HTMLDivElement | null>(null)
const selectedPosition = ref<GeoPoint>(props.initialPosition ?? { lat: 37.5665, lng: 126.978 })
const searchQuery = ref('')
const searchStatus = ref('')
const searching = ref(false)

let kakaoApi: KakaoNamespace | null = null
let map: any = null
let marker: any = null
let clickHandler: any = null
let geocoder: any = null

function setMarkerPosition(position: GeoPoint) {
  selectedPosition.value = position
  if (!marker || !kakaoApi) return
  const latlng = new kakaoApi.maps.LatLng(position.lat, position.lng)
  marker.setPosition(latlng)
  map?.setCenter(latlng)
}

function confirmSelection() {
  emit('confirm', selectedPosition.value)
}

function searchAddress() {
  const query = searchQuery.value.trim()
  if (!query) {
    searchStatus.value = '주소를 입력해 주세요.'
    return
  }
  if (!geocoder && kakaoApi?.maps?.services) {
    geocoder = new kakaoApi.maps.services.Geocoder()
  }
  if (!geocoder) {
    searchStatus.value = '카카오 지도 서비스를 사용할 수 없습니다.'
    return
  }
  searching.value = true
  searchStatus.value = '검색 중...'
  geocoder.addressSearch(query, (result: any[], status: string) => {
    searching.value = false
    if (status !== kakaoApi?.maps?.services?.Status.OK || !result?.length) {
      searchStatus.value = '주소를 찾지 못했어요. 다시 시도해 주세요.'
      return
    }
    const first = result[0]
    const position = {
      lat: Number(first.y),
      lng: Number(first.x),
    }
    searchStatus.value = `${first.address?.address_name ?? '선택한 위치'}로 이동했어요.`
    setMarkerPosition(position)
  })
}

async function initMap() {
  const kakao = await loadKakaoMaps()
  if (!kakao) {
    // eslint-disable-next-line no-console
    console.error('[LocationPicker] 카카오 지도를 불러오지 못했습니다.')
    return
  }
  kakaoApi = kakao
  const center = new kakao.maps.LatLng(selectedPosition.value.lat, selectedPosition.value.lng)
  map = new kakao.maps.Map(mapEl.value, {
    center,
    level: 4,
  })
  marker = new kakao.maps.Marker({
    position: center,
    draggable: true,
    map,
  })
  geocoder = new kakao.maps.services.Geocoder()

  kakao.maps.event.addListener(marker, 'dragend', () => {
    const position = marker.getPosition()
    selectedPosition.value = { lat: position.getLat(), lng: position.getLng() }
  })

  clickHandler = kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
    const latlng = mouseEvent.latLng
    selectedPosition.value = { lat: latlng.getLat(), lng: latlng.getLng() }
    marker.setPosition(latlng)
  })
}

watch(
  () => props.initialPosition,
  newPos => {
    if (newPos) {
      setMarkerPosition(newPos)
    }
  },
  { immediate: true },
)

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (kakaoApi && map && clickHandler) {
    kakaoApi.maps.event.removeListener(map, 'click', clickHandler)
  }
  map = null
  kakaoApi = null
})
</script>

<style scoped>
.location-picker-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 20px;
}

.location-picker {
  width: min(420px, 90vw);
  border-radius: 24px;
  background: #fffdf5;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
  display: grid;
  gap: 12px;
  padding: 18px;
}

.location-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.location-picker__header h2 {
  margin: 0;
  font-size: 18px;
  color: #92400e;
}

.location-picker__close {
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  color: #b45309;
}

.location-picker__map {
  width: 100%;
  height: 260px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.location-picker__search {
  display: flex;
  gap: 8px;
}

.location-picker__search input {
  flex: 1;
  border: 1px solid rgba(251, 191, 36, 0.6);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 16px;
  line-height: 1.2;
  background: #fffef5;
}

.location-picker__search button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 600;
  background: rgba(251, 191, 36, 0.4);
  color: #92400e;
  cursor: pointer;
}

.location-picker__search button:disabled {
  opacity: 0.6;
  cursor: progress;
}

.location-picker__status {
  margin: 0;
  font-size: 12px;
  color: #b45309;
}

.location-picker__coords {
  margin: 0;
  font-size: 13px;
  color: #78350f;
  text-align: center;
}

.location-picker__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.picker-btn {
  border-radius: 14px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.picker-btn--ghost {
  background: rgba(253, 230, 138, 0.25);
  color: #92400e;
}

.picker-btn--primary {
  background: #fbbf24;
  color: #7c2d12;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35);
}
</style>
